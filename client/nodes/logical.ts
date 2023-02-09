import {SelectInterface,defineNode, NodeInterface, TextInputInterface} from "baklavajs";

export const LRLogicalExpression = defineNode({
  type: "二元逻辑运算",
  inputs: {
    left: () => new NodeInterface("A", 0),
    right: () => new NodeInterface("B", 0),
    operator: () => new SelectInterface("运算符", "A大于B",["A大于B","A小于B","A等于B","A不等于B","A大于等于B","A小于等于B"]),
  },
  outputs: {
    value: () => new NodeInterface("输出值", 0)
  }
});

export const SingleLogicalExpression = defineNode({
  type: "单元逻辑运算",
  inputs: {
    value: () => new NodeInterface("值", 0),
    operator: () => new SelectInterface("运算符", "!",["取反"]),
  },
  outputs: {
    value: () => new NodeInterface("输出值", 0)
  }
})

export const TernaryLogicalExpression = defineNode({
  type: "三元逻辑运算",
  inputs: {
    condition: () => new NodeInterface("条件", 0),
    trueValue: () => new TextInputInterface("真值", ""),
    falseValue: () => new TextInputInterface("假值", ""),
  },
  outputs: {
    value: () => new NodeInterface("输出值", 0)
  }
})

export const LogicalNodes = [
  LRLogicalExpression,
  SingleLogicalExpression,
  TernaryLogicalExpression
].map((node) => [node,"逻辑"]);
