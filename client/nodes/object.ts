import {defineNode, NodeInterface, TextInputInterface} from "baklavajs";

export const GetObjectProperty = defineNode({
  type: "获取对象属性",
  inputs: {
    object: () => new NodeInterface("对象", 0),
    property: () => new TextInputInterface("属性","")
  },
  outputs: {
    value: () => new NodeInterface("值", 0)
  },
  calculate(){
    return {}
  }
})

export const SetObjectProperty = defineNode({
  type: "设置对象属性",
  inputs: {
    object: () => new NodeInterface("对象", 0),
    property: () => new TextInputInterface("属性",""),
    value: () => new TextInputInterface("值", ""),
  },
  outputs: {
    value: () => new NodeInterface("改变后的对象", 0)
  },
  calculate(input,ctx){
    return {}
  }
});

export const ObjectNodes = [
  GetObjectProperty,
  SetObjectProperty
].map((node) => [node,"对象"]);
