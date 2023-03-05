import {Context} from "koishi";
import {} from "./structure"
import {v4 as uuidV4} from "uuid";

declare module '@koishijs/plugin-console' {
  interface Events {
    'create-blockly-block'(uuid?:string): Promise<number>
    'save-blockly-block'(id:number, data:{body?:object,code?:string,name?:string}): void
    'load-blockly-block'(id:number): Promise<object>
    'rename-blockly-block'(id:number, name:string): Promise<void>
    'delete-blockly-block'(id:number): Promise<void>
    'set-blockly-block-state'(id:number,enabled:boolean): Promise<void>
  }
}

export function initializeConsoleApiBacked(ctx:Context){
  ctx.console.addListener("load-blockly-block",async (id:number)=>{
    return JSON.parse((await ctx.database.get("blockly",id,['body']))[0].body)
  },{authority:5})

  ctx.console.addListener("save-blockly-block",async (id:number, data)=>{
    const save_object = {}
    if(data.body)save_object['body'] = JSON.stringify(data.body)
    if(data.code)save_object['code'] = data.code
    if(data.name)save_object['name'] = data.name
    save_object ['edited'] = !data.code
    await ctx.database.set("blockly",id,save_object)
    setTimeout(()=>ctx.blockly.reload(!!data.code),0)
    //console.info(save_object)
  },{authority:5})

  ctx.console.addListener("rename-blockly-block",async (id:number, name:string)=>{
    await ctx.database.set("blockly",id,{name})
    await ctx.blockly.reload()
  },{authority:5})

  ctx.console.addListener("rename-blockly-block",async (id:number, name:string)=>{
    await ctx.database.set("blockly",id,{name})
    await ctx.blockly.reload()
  },{authority:5})

  ctx.console.addListener("delete-blockly-block",async (id:number)=>{
    await ctx.database.remove("blockly",{id})
    await ctx.blockly.reload()
  },{authority:5})

  ctx.console.addListener("create-blockly-block",async (uuid)=>{

    if(uuid){
      const blocks = await ctx.database.get("blockly",{uuid},['id'])
      if(blocks.length>0)return blocks[0].id
    }

    const data = await ctx.database.create('blockly',{
      name:'未命名Koishi代码',
      code:'',
      body:'{}',
      enabled:false,
      edited:false,
      uuid:uuid??uuidV4()
    })

    await ctx.blockly.reload()
    return data.id
  },{authority:5})

  ctx.console.addListener("set-blockly-block-state",async (id, enabled)=>{
    await ctx.database.set("blockly",id,{enabled})
    await ctx.blockly.reload(true)
  },{authority:5})
}
