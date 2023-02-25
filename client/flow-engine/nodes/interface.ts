import {defineNode} from "@baklavajs/core";
import {defineDynamicNode, NodeInterface, SelectInterface, TextInputInterface} from "baklavajs";

export const HttpNode = defineNode({
  type: "http",
  title: "HTTP请求",
  inputs: {
    url: () => new TextInputInterface("URL", ""),
    method: () => new SelectInterface("方法", 'GET', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']).setPort(false),
    headers: () => new NodeInterface("头部", 0),
    body: () => new NodeInterface("主体", 0)
  },
  outputs:{
    code: () => new NodeInterface("状态码", 0),
    body: () => new NodeInterface("返回体", 0),
    headers: () => new NodeInterface("返回头部", 0),
  }
})

export const CallBlocklyNode = defineDynamicNode({
  type: "call_blockly",
  title: "调用Blockly",
  inputs: {
    script: () => new SelectInterface("脚本", "",[]).setPort(false)
  },
  outputs:{
    output: () => new NodeInterface("输出", 0)
  },
  onUpdate(){
    return {}
  }
})

export const InterfaceNodes = [
  HttpNode,
  //CallBlocklyNode
].map((node) => [node,"接口"]);
