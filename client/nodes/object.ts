import {defineDynamicNode, defineNode, NodeInterface, TextInputInterface} from "baklavajs";

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

export const CreateObject = defineDynamicNode({
  type: "创建对象",
  inputs: {
    prototype: () => new TextInputInterface("原型，用逗号分隔", "").setPort(false)
  },
  outputs: {
    value: () => new NodeInterface("对象", 0)
  },
  onUpdate(){
    return {
      inputs: Object.fromEntries(this.inputs.prototype.value?.split(",").filter(t=>t).map((name) => [name, () => new NodeInterface(name, 0)]))
    }
  }
})

export const SplitObject = defineDynamicNode({
  type: "分离对象",
  inputs: {
    value: () => new NodeInterface("对象", 0),
    prototype: () => new TextInputInterface("原型，用逗号分隔", "").setPort(false)
  },
  onUpdate(){
    return {
      outputs: Object.fromEntries(this.inputs.prototype.value?.split(",").filter(t=>t).map((name) => [name, () => new NodeInterface(name, 0)]))
    }
  }
})

export const ObjectNodes = [
  CreateObject,
  SplitObject,
  GetObjectProperty,
  SetObjectProperty
].map((node) => [node,"对象"]);
