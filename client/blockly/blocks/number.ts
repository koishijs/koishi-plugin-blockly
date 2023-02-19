import {javascriptGenerator} from "blockly/javascript";

export const ToNumberBlock = {
  "type": "to_number",
  "message0": "转换为数字 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "value"
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function toNumberBlockGenerator(block){
  let value = javascriptGenerator.valueToCode(block, 'value', javascriptGenerator.ORDER_ATOMIC)
  return [`Number(${value})`, javascriptGenerator.ORDER_ATOMIC];
}

export const NumberBlocks = [
  ToNumberBlock
]

export const numberBlockGenerators = {
  to_number: toNumberBlockGenerator
}
