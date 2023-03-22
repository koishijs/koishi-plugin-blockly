import {Block} from "blockly";
import * as Blockly from "blockly";
import {deduplicate} from 'cosmokit'
import {FieldBindingStringDropdown} from "../fields/binding";
import {ReactiveValue} from "../binding";

export const TypeRootBlock = {
  "type": "type_root",
  "message0": "类型 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "type",
      "check": "Type",
    }
  ],
  "colour": "#ce4bc9",
  "tooltip": "",
  "helpUrl": ""
}

export const TypeDefinitionBlock = {
  "type": "type_definition",
  "message0": "定义类型 %1 %2",
  "args0": [
    {
      "type": "field_input",
      "name": "name",
      "text": "类型名称"
    },
    {
      "type": "input_value",
      "name": "type",
      "check": "Type",
    }
  ],
  "colour": "#ce4bc9",
  "tooltip": "",
  "helpUrl": "",
  init(this:Block&Record<any,any>){
    if(!this.workspace.typings)return
    this.type_value = new ReactiveValue<string>(this.getFieldValue('name'),this.id)
    this.workspace.typings.add(this.type_value)
    this.onchange = ()=>{
      this.type_value.set(this.getFieldValue('name'))
    }
    const dispose = this.dispose
    this.dispose = (h)=>{
      this.workspace.typings.delete(this.type_value)
      dispose.bind(this)(h)
    }
  }
}

export const TypeAnyBlock = {
  "type": "type_any",
  "message0": "任意类型",
  "output": "Type",
  "colour": "#ce4bc9",
  "tooltip": "",
}

export const TypeNeverBlock = {
  "type": "type_never",
  "message0": "永远不会出现的类型",
  "output": "Type",
  "colour": "#ce4bc9",
  "tooltip": ""
}

export const TypeStringBlock = {
  "type": "type_string",
  "message0": "字符串",
  "output": "Type",
  "colour": "#ce4bc9",
  "tooltip": "",
}

export const TypeNumberBlock = {
  "type": "type_number",
  "message0": "数字",
  "output": "Type",
  "colour": "#ce4bc9",
  "tooltip": "",
}

export const TypeBooleanBlock = {
  "type": "type_boolean",
  "message0": "布尔值",
  "output": "Type",
  "colour": "#ce4bc9",
  "tooltip": "",
}

export const TypeArrayBlock = {
  "type": "type_array",
  "message0": "由%1组成的数组",
  "args0": [
    {
      "type": "input_value",
      "name": "type",
      "check": "Type"
    }
  ],
  "output": "Type",
  "colour": "#ce4bc9",
}

export const TypeUnionRootBlock = {
  "type": "type_union_root",
  "message0": "联合类型 %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "types",
      "check": "Type"
    }
    ]
}

export const TypeUnionEntityBlock = {
  "type": "type_union_entity",
  "message0": "项目",
  "previousStatement": "Type",
  "nextStatement": "Type",
  "colour": 160
}

export const TypeUnionBlock = {
  "type": "type_union",
  "output": "Type",
  "message0": "联合类型",
  "args0":[],
  init(){
    this.updateShape_()
  },
  "mutator":"union_mutator",
  "colour": "#ce4bc9",
}

export const TypeObjectRootBlock = {
  "type": "type_object_root",
  "message0": "对象 %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "properties",
      "check": "Type"
    },
  ],
  "colour": "#ce4bc9",
  "tooltip": "",
  "helpUrl": ""
}

export const TypeObjectEntityBlock = {
  "type": "type_object_entity",
  "message0": "属性 %1",
  "args0": [
    {
      "type": "field_input",
      "name": "name",
      "text": "属性名称"
    }
    ],
  "previousStatement": "Type",
  "nextStatement": "Type",
  "colour": 160
}

export const TypeObjectBlock = {
  "type": "type_object",
  "message0": "对象",
  "output": "Type",
  "colour": "#ce4bc9",
  "tooltip": "",
  "helpUrl": "",
  "mutator":"object_mutator"
}

export const TypeGetter = {
  "type": "type_getter",
  "message0": "类型",
  "output": "Type",
  "colour": "#ce4bc9",
  "tooltip": "",
  "helpUrl": "",
  init(this:Block){
    let field
    if(this.workspace.typings) {
      field = new FieldBindingStringDropdown(this.workspace.typings)
      this.inputList[0].appendField(field, "type")
    }
  }
}

export const TypeBlocks = [
  TypeRootBlock,
  TypeAnyBlock,
  TypeNeverBlock,
  TypeStringBlock,
  TypeNumberBlock,
  TypeBooleanBlock,
  TypeArrayBlock,
  TypeUnionRootBlock,
  TypeUnionEntityBlock,
  TypeUnionBlock,
  TypeDefinitionBlock,
  TypeObjectRootBlock,
  TypeObjectEntityBlock,
  TypeObjectBlock,
  TypeGetter
]
