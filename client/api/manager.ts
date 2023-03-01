import {send, store} from "@koishijs/client";
import {decodeBlocklyExport, encodeBlocklyExport} from "../blockly/pack";
import {build, createWrapper} from "../blockly/build";
import {javascriptGenerator} from "blockly/javascript";
import * as semver from 'semver'
import {ElMessageBox} from "element-plus";
import {BLOCKLY_API_VERSION, BLOCKLY_VERSION} from "../version";

export const createBlockly = async () => (await send('create-blockly-block')).toString()

export const saveBlockly = async (current,workspace) => {
  if(current==undefined)return;
  await send('save-blockly-block',current,{body:workspace.save()})
}

export async function buildBlockly(id:number|undefined,name:string,plugin_id:string,workspace,logger){
  if(id==undefined)return
  logger.info("正在开始编译.......")
  let code
  try {
    code = build(name,plugin_id,workspace.getWorkspaceSvg())
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

export async function exportPlugin(id:number|undefined,name:string,uuid:string,workspace){
  if(id==undefined)return
  return encodeBlocklyExport(name,uuid,workspace.save())
}

export async function importPlugin(content,asNewPlugin) {
  if (content.length == 0) {
    return
  }
  const documentData = decodeBlocklyExport(content)
  console.info(documentData)
  if (!documentData) {
    return
  }
  if(documentData.version!=BLOCKLY_API_VERSION) {
    ElMessageBox.alert(`无法读取该插件: 该插件的API Major版本(${documentData.version})不兼容当前版本`)
    return
  }
  if(documentData.plugin_version && semver.cmp(documentData.plugin_version,'>',BLOCKLY_VERSION)){
    if(await ElMessageBox.confirm(`该插件是由更高版本(${documentData.plugin_version})的Blockly插件导出的，可能无法正常导入或执行异常。建议升级您的Blockly版本到最新版本`, '提示', {
      confirmButtonText: '继续',
      cancelButtonText: '取消',
      type: 'warning'
    }) == 'cancel')
      return
  }
  if(documentData.plugin_version && semver.major(documentData.plugin_version)!=semver.major(BLOCKLY_VERSION)){
    if(await ElMessageBox.confirm(`该插件是由不同主版本(${documentData.plugin_version})的Blockly插件导出的，可能无法正常导入或执行异常。`, '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }) == 'cancel')
      return
  }
  if(!asNewPlugin && documentData?.uuid){
    if(store.blockly.filter(t=>t.uuid==documentData.uuid).length>0){
      if(await ElMessageBox.confirm('检测到该插件已存在，是否覆盖？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }) == 'cancel')
        return
    }
  }
  const id = await send('create-blockly-block',asNewPlugin?undefined:documentData.uuid)
  await send('save-blockly-block', id, {
    body: documentData.body,
    name: documentData.name
  })
  return id.toString()
}
