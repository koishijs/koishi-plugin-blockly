import {javascriptGenerator} from "blockly/javascript";
export const RegularExp = {
    "type": "regular_exp",
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

export function regularExp(block) {  
  let text_regular = block.getFieldValue('regular');
  let value_text = javascriptGenerator.valueToCode(block, 'str', javascriptGenerator.ORDER_ATOMIC);
  let reg_exp = new RegExp("\/(.*)\/([g|m|i|y|u|s|d]+)", "g").exec(text_regular);
  value_text = value_text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  return [`${ value_text }.match(new RegExp("${ reg_exp[1] }", "${ reg_exp[2] }"))`, javascriptGenerator.ORDER_NONE];
}

export const TextBlocks = [
    RegularExp
]
  
export const textBlocks = {
   'regular_exp':regularExp
}