import {javascriptGenerator} from "blockly/javascript";
import {TextTemplateIcon} from "../../icons/template";
import {FieldImage} from "blockly";
import {ElMessageBox} from "element-plus";
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

export const TemplateStringBlock = {
  "type": "template_string",
  "message0": "%1 模板字符串",
  "args0": [
    {
      "type": "field_image",
      "name":"edit_template",
      "src": TextTemplateIcon,
      "alt": "编辑模板",
      "width": 25,
      "height": 25
    }
    ],
  "output": null,
  "colour": 160,
  init(){
    (this.getField("edit_template") as FieldImage).setOnClickHandler(async (field)=> {
      // Show the editor , wait for the flow engine merged
      const workspace = field.getSourceBlock().workspace
      const s = await workspace['topLevel'].openDialog('text-template',{})
      console.info(s)
    })
  }
}

export const TextBlocks = [
  TemplateStringBlock,
  RegularBlock
]

export const textBlockGenerators = {
  "regular":regularBlockGenerator
}
