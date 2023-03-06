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
  "helpUrl": ""
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
  "message0": "由...组成的数组 %1",
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

export const TypeBlocks = [
  TypeRootBlock,
  TypeStringBlock,
  TypeNumberBlock,
  TypeBooleanBlock,
  TypeArrayBlock,
  TypeUnionRootBlock,
  TypeUnionEntityBlock,
  TypeUnionBlock,
  TypeDefinitionBlock
]
