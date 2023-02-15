import {gzip, ungzip} from "pako";
import {stringToArrayBuffer} from "../utils";

export function encodeBlocklyExport(name:string,body){
  const exportObject = {
    version:1,
    body,
    name
  }

  const encodedShareObject = encodeURI(JSON.stringify(exportObject))

  const shareBody = btoa(String.fromCharCode.apply(null, gzip(encodedShareObject)))

  let shareCode = `插件名称: ${name}\n`
  shareCode += `导出时间: ${new Date().toLocaleString()}\n`
  shareCode += `-=-=-=-=--=-=-=-=- BEGIN KOISHI BLOCKLY BLOCK V1 -=-=--=-=-=--=-=--=-=-=-\n`
  shareCode +=`${shareBody.replace(/(.{64})/g, "$1\n")}\n`
  shareCode += `-=-=--=-=-=--=-=-=-=- END KOISHI BLOCKLY BLOCK V1 -=-=--=-=-=--=-=--=-=-=-\n`
  return shareCode.replace("\n\n","\n")
}

export function decodeBlocklyExport(content:string):{body:object,name:string}|null{

  const data_body = content
    .match(/[=–-]+\s+BEGIN KOISHI BLOCKLY BLOCK V1\s+[=–-]+\n([\s\S]+)\n[=–-]+\s+END KOISHI BLOCKLY BLOCK V1\s+[=–-]+/)?.[1]
    .replace(/[\r\n\t ]/g,'')

  if(!data_body) {
    return null
  }

  const encodedShareObject = ungzip(stringToArrayBuffer(atob(data_body)), {to: 'string'})

  if(!encodedShareObject) {
    return null
  }

  const data = JSON.parse(decodeURI(encodedShareObject))

  if(!data){
    return null
  }

  return data
}
