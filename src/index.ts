import {Context, Disposable, ForkScope, Schema} from 'koishi'
import { resolve } from 'path'
import {DataService} from '@koishijs/plugin-console'
import {Block} from "blockly";
import vm from 'node:vm';

export const name = 'blockly'

export interface Config {}

export interface BlocklyDocument{
  id:number
  name:string
  body:object
  code:string
}

declare module "koishi"{
  interface Tables{
    blockly:BlocklyDocument
  }
}

declare module '@koishijs/plugin-console' {
  interface Events {
    'create-block'(): void
    'save-blockly'(id:number,data:{body:object,code:string}): void
    'load-blockly'(id:number): Promise<object>
  }
  namespace Console{
    interface Services {
      blockly: BlocklyProvider
    }
  }
}

class BlocklyProvider extends DataService<{id:number,name:string}[]> {
  constructor(ctx: Context) {
    super(ctx, 'blockly')
  }
  async get() {
    return (await this.ctx.database.get('blockly',{id:{$not:-1}},["id","name"])).map(t=>({id:t.id,name:t.name}))
  }
}

export class PluginManager{
  plugins:string[] = [];
  runningPlugins:ForkScope[] = [];
  constructor(protected ctx:Context) {
    this.restart()
  }
  restart(){
    this.ctx.logger("blockly").info("Reloading....")
    this.runningPlugins.forEach(t=>t.dispose())
    this.runningPlugins = []
    this.plugins.forEach(p=>{
      const context = vm.createContext({})
      let plugin = null
      try{
        plugin = vm.runInContext(p,context)
      }catch (e){
        this.ctx.logger("blockly").warn(e);
      }
      if(plugin && plugin['apply'])
        this.runningPlugins.push(this.ctx.plugin(plugin))
    })
  }
}

export const Config: Schema<Config> = Schema.object({})

export const using = ['database','console']

export async function apply(ctx: Context) {
  ctx.database.extend('blockly',{
    id:'integer',
    name:'string',
    body:'json',
    code:'text'
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

  ctx.console.addListener("load-blockly",async (id:number)=>{
    return (await ctx.database.get("blockly",id,['body']))[0].body
  })

  ctx.console.addListener("save-blockly",async (id:number,data)=>{
    await ctx.database.set("blockly",id,data);
    updatePmPlugins(ctx);
  })

  ctx.console.addListener("create-block",async ()=>{
    await ctx.database.create("blockly",{
      name:'未命名Koishi插件',
      body:{},
      code:''
    });
    updatePmPlugins(ctx);
  })

  let pm = new PluginManager(ctx.isolate([]));

  async function updatePmPlugins(ctx:Context){
    const plugins = (await ctx.database.get('blockly',{id:{$not:-1}}));
    ctx.using(["console.blockly"],(ctx:Context)=>{
      ctx["console.blockly"].patch(plugins)
    })
    pm.plugins = plugins.map(t=>t.code)
    pm.restart()
  }
  await updatePmPlugins(ctx)
  pm.restart()
}
