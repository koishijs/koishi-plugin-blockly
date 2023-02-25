import {defineNode} from "@baklavajs/core";
import {NodeInterface, TextInputInterface} from "baklavajs";


export const Queue = defineNode({
  type: "queue",
  title: "队列",
  inputs: {
    value: () => new NodeInterface("输入值", 0),
    length: () => new TextInputInterface("长度", "10").setPort(false)
  },
  outputs: {
    value: () => new NodeInterface("队列输出", 0),
    overflow: () => new NodeInterface("溢出", 0)
  }
})

export const Structure = [
  Queue
].map((node) => [node,"数据结构"]);
