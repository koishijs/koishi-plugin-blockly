import {Context, ForkScope, Logger, Schema, segment} from 'koishi'
import path, { resolve } from 'path'
import {DataService} from '@koishijs/plugin-console'
import vm from 'node:vm';
import {BlocklyService} from "./service";
import * as fs from "fs";

export const name = 'blockly'

export interface Config {}

export interface BlocklyDocument{
  id:number
  name:string
  body:string
  code:string
  enabled:boolean
  edited:boolean
}

declare module "koishi"{
  interface Tables{
    blockly:BlocklyDocument
  }
}

declare module '@koishijs/plugin-console' {
  interface Events {
    'create-blockly-block'(): Promise<number>
    'save-blockly-block'(id:number, data:{body?:object,code?:string,name?:string}): void
    'load-blockly-block'(id:number): Promise<object>
    'rename-blockly-block'(id:number, name:string): Promise<void>
    'delete-blockly-block'(id:number): Promise<void>
    'set-blockly-block-state'(id:number,enabled:boolean): Promise<void>
  }
  namespace Console{
    interface Services {
      blockly: BlocklyProvider
    }
  }
}

export interface BlocklyMenuItem{
  id:number
  name:string
  enabled:boolean
  edited:boolean
}

class BlocklyProvider extends DataService<BlocklyMenuItem[]> {
  constructor(ctx: Context) {
    super(ctx, 'blockly')
  }
  async get() {
    return (await this.ctx.database.get('blockly',{id:{$not:-1}},["id","name","enabled","edited"]))
  }
}

export class PluginManager{
  plugins:string[] = [];
  runningPlugins:ForkScope[] = [];
  private logger: Logger;
  constructor(protected ctx:Context) {
    this.restart()
    this.logger = this.ctx.logger("blockly")
  }
  restart(){
    this.runningPlugins.forEach(t=>t.dispose())
    this.runningPlugins = []
    if(this.plugins.length == 0){
      this.logger?.info("No plugin loaded")
      return;
    }
    this.logger.info("Loading "+this.plugins.length +" plugin(s)")
    this.plugins.forEach(p=>{
      const context = vm.createContext({})
      context.segment = segment;
      context.module = {exports:{}};
      let plugin = null
      try{
        vm.runInContext(p,context)
        plugin = context.module.exports
      }catch (e){
        this.ctx.logger("blockly").warn(e);
      }
      if(plugin && plugin['apply'])
        this.runningPlugins.push(this.ctx.plugin(plugin))
    })
    this.logger.info("Loaded "+this.runningPlugins.length +" plugin(s)")
  }
}

export const Config: Schema<Config> = Schema.object({})

export const using = ['database','console']

export async function apply(ctx: Context) {
  ctx.plugin(BlocklyService)
  ctx.database.extend('blockly',{
    id:'integer',
    name:'string',
    body:'text',
    code:'text',
    enabled:'boolean',
    edited:'boolean'
  },{
    autoInc:true
  })
  ctx.plugin(BlocklyProvider)
  ctx.using(['console'], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  })

  ctx.console.addListener("load-blockly-block",async (id:number)=>{
    return JSON.parse((await ctx.database.get("blockly",id,['body']))[0].body);
  },{authority:5})

  ctx.console.addListener("save-blockly-block",async (id:number, data)=>{
    const save_object = {}
    if(data.body)save_object['body'] = JSON.stringify(data.body)
    if(data.code)save_object['code'] = data.code
    if(data.name)save_object['name'] = data.name
    save_object ['edited'] = !data.code
    await ctx.database.set("blockly",id,save_object);
    setTimeout(()=>updatePmPlugins(ctx,!!data.code),0);
    //console.info(save_object)
  },{authority:5})
  const logger = ctx.logger('logger1')
  ctx.console.addListener("rename-blockly-block",async (id:number, name:string)=>{
    await ctx.database.set("blockly",id,{name});
    await updatePmPlugins(ctx)
  },{authority:5});

  ctx.console.addListener("rename-blockly-block",async (id:number, name:string)=>{
    await ctx.database.set("blockly",id,{name});
    await updatePmPlugins(ctx)
  },{authority:5});

  ctx.console.addListener("delete-blockly-block",async (id:number)=>{
    await ctx.database.remove("blockly",{id});
    await updatePmPlugins(ctx)
  },{authority:5});

  ctx.console.addListener("create-blockly-block",async ()=>{
    const data = await ctx.database.create('blockly',{
      name:'未命名Koishi代码',
      code:'',
      body:'{}',
      enabled:false,
      edited:false
    })
    await updatePmPlugins(ctx);
    return data.id
  },{authority:5})

  ctx.console.addListener("set-blockly-block-state",async (id, enabled)=>{
    await ctx.database.set("blockly",id,{enabled});
    await updatePmPlugins(ctx);
  },{authority:5})

  let pm = new PluginManager(ctx.isolate([]))

  async function updatePmPlugins(ctx:Context,restart=true){
    if(restart){
      pm.plugins = (await ctx.database.get('blockly',{enabled:true},["code","enabled"]))
        .filter(t=>t.enabled).map(t=>t.code)
      pm.restart()
    }
    if(ctx['console.blockly']){
      await ctx['console.blockly'].refresh()
    }
  }
  await updatePmPlugins(ctx)

  ctx.router.get(/\/static\/blockly\/([a-z0-9-]+.[a-z0-9]+)/,async function (ctx) {
    const resource_path = path.resolve(__dirname,'../media/'+ctx.params[0])
    if(path.relative(path.resolve(__dirname+'/../'),resource_path).startsWith('..')){
      return
    }
    if(!fs.existsSync(resource_path)){
      return
    }
    ctx.body = await fs.promises.readFile(resource_path)
  })
}
