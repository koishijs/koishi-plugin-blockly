import {defineNode, NodeInterface, TextInputInterface} from "baklavajs";
export const InputBlock = defineNode({
  type: "input",
  title: "输入",
  inputs: {
    name: () => new TextInputInterface("字段名称", "").setPort(false),
  },
  outputs: {
    output: () => new NodeInterface("输入值", 0),
  },
  calculate() {
    return {}
  },
});

export const OutputBlock = defineNode({
  type: "output",
  title: "输出",
  inputs: {
    output: () => new NodeInterface("输出值", 0),
  },
  calculate() {
    return {}
  },
});

export const IOBlocks = [
  InputBlock,
  OutputBlock
].map((node) => [node,"输入与输出"]);
