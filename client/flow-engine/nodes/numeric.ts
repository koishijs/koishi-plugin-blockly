import {TextInputInterface} from "baklavajs";
import {defineNode, NodeInterface} from "@baklavajs/core";

export const ConstNumber = defineNode({
  type: "toNumber",
  title: "转为数字/数字常量",
  inputs: {
    value: () => new TextInputInterface("输入", "0"),
  },
  outputs: {
    value: () => new NodeInterface("输出", "0")
  }
})

export const NumericNodes = [
  ConstNumber
].map((node) => [node,"数字"]);
