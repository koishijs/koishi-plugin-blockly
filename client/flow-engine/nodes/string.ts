import {NodeInterface} from "@baklavajs/core";
import {TextInputInterface, defineDynamicNode} from "baklavajs";

export const StringTemplateNode = defineDynamicNode({
  type: "字符串模板",
  inputs: {
    template: () => new TextInputInterface("模板", "").setPort(false),
  },
  outputs: {
    value: () => new NodeInterface("输出", ""),
  },
  onUpdate({template}) {
    const matches = template.match(/%.+?%/g)
    return {
      inputs: matches ? Object.fromEntries(matches.map(t => t.slice(1, -1)).map(t => [t, () => new TextInputInterface(t, "")])) : undefined
    }
  }
})


export const StringNode = [
  StringTemplateNode
].map((node) => [node, "字符串"]);
