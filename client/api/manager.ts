import {send} from "@koishijs/client";
import {decodeBlocklyExport, encodeBlocklyExport} from "../blockly/pack";
import {createWrapper} from "../blockly/build";
import {javascriptGenerator} from "blockly/javascript";

export const createBlockly = async () => (await send('create-blockly-block')).toString()

export const saveBlockly = async (current,workspace) => {
  if(current==undefined)return;
  await send('save-blockly-block',current,{body:workspace.save()})
}

export async function buildBlockly(id:number|undefined,name:string,workspace,logger){
  if(id==undefined)return
  logger.info("正在开始编译.......")
  let code
  try {
    code = createWrapper(name,[],javascriptGenerator.workspaceToCode(workspace.getWorkspaceSvg()))
  }catch (e){
    logger.error("编译时发生错误: "+e.toString())
    console.error(e)
    return
  }
  logger.info("正在上传......")
  await send('save-blockly-block',id,{code})
  logger.success("上传成功")
  return code
}

export async function enableBlockly(id:number|undefined){
  if(id==undefined)return;
  await send('set-blockly-block-state',id,true)
}

export async function disableBlockly(id:number|undefined){
  if(id==undefined)return;
  await send('set-blockly-block-state',id,false)
}

export async function renameBlockly(id:number|undefined,name:string){
  if(id==undefined){
    return
  }
  await send('rename-blockly-block',id,name)
}

export async function deletePlugin(id:number|undefined){
  if(id==undefined)return
  await send('delete-blockly-block',id)
}

export async function exportPlugin(id:number|undefined,name:string,workspace){
  if(id==undefined)return
  return encodeBlocklyExport(name,workspace.save())
}

export async function importPlugin(content) {
  if (content.length == 0) {
    return
  }
  const documentData = decodeBlocklyExport(content)

  console.info(documentData)
  if (!documentData) {
    return
  }
  const id = await send('create-blockly-block')
  await send('save-blockly-block', id, {
    body: documentData.body,
    name: documentData.name
  })
  return id.toString()
}
