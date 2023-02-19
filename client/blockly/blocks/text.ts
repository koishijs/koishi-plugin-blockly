import {javascriptGenerator} from "blockly/javascript";
export const RegularBlock = {
  "type": "regular",
  "message0": "正则表达式 %1 %2",
  "args0": [
    {
      "type": "field_input",
      "name": "regular",
      "text": "/.*/g"
    },
    {
      "type": "input_value",
      "name": "str"
    }
  ],
  "output": null,
  "colour": 160,
  "tooltip": "",
  "helpUrl": ""
}

export function regularBlockGenerator(block) {
  let text_regular = block.getFieldValue('regular')
  let value_text = javascriptGenerator.valueToCode(block, 'str', javascriptGenerator.ORDER_ATOMIC)
  let reg_exp = text_regular?.match("\/(.*)\/([gmiyusd]*)")
  return [`(${value_text}).match(new RegExp("${reg_exp[1]}", "${reg_exp[2]}"))`,javascriptGenerator.ORDER_ATOMIC]
}

export const TextBlocks = [
  RegularBlock
]

export const textBlockGenerators = {
  "regular":regularBlockGenerator
}
