import {javascriptGenerator} from "blockly/javascript";
export const RegularExp = {
  "type": "regular_exp",
  "message0": "表达式 %1 修饰符 %2 %3",
  "args0": [
    {
      "type": "field_input",
      "name": "regular",
      "text": ".*"
    },
    {
      "type": "field_input",
      "name": "modifier",
      "text": "m"
    },
    {
      "type": "input_value",
      "name": "text"
    }
  ],
  "output": null,
  "colour": 120,
  "tooltip": "",
  "helpUrl": ""
}

export function regularExp(block) {  
  let text_regular = block.getFieldValue('regular');
  let text_modifier = block.getFieldValue('modifier');
  let value_text = javascriptGenerator.valueToCode(block, 'text', javascriptGenerator.ORDER_ATOMIC);
  return [`${value_text}.match(/${text_regular}/${text_modifier})`, javascriptGenerator.ORDER_NONE];
}

export const TextBlocks = [
    RegularExp
]
  
export const textBlocks = {
   'regular_exp':regularExp
}