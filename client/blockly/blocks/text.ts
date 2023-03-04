import {javascriptGenerator} from "blockly/javascript";
import {TextTemplateIcon} from "../../icons/template";
import {FieldImage} from "blockly";
import {ElMessageBox} from "element-plus";
import templates from "rollup-plugin-visualizer/dist/plugin/template-types";
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
    this.loadSlotsWithTemplate = function(){
      this.inputList
        .filter((input)=>input.name.startsWith("input_"))
        .forEach((input)=>this.removeInput(input.name))
      if(!this.text_template){
        return;
      }
      this.text_template.variables.forEach((variable)=>{
        this.appendValueInput(`input_${variable}`)
          .appendField(variable)
      })
    };
    (this.getField("edit_template") as FieldImage).setOnClickHandler(async (field)=> {
      // Show the editor , wait for the flow engine merged
      const workspace = field.getSourceBlock().workspace
      this.text_template = await workspace['topLevel'].openDialog('text-template',this.text_template??{variables:[]})
      console.info(this.text_template)
      this.loadSlotsWithTemplate()
    })
    this.saveExtraState = function(){
      return {
        template:this.text_template
      }
    }
    this.loadExtraState = function(state){
      this.text_template = state.template
      this.loadSlotsWithTemplate()
    }
  }
}

export function templateStringBlockGenerator(block) {
  if(!block.text_template){
    return ["\"\"",javascriptGenerator.ORDER_ATOMIC]
  }
  const variables = block.text_template.variables
  const values = variables.map((variable)=>{
    return javascriptGenerator.valueToCode(block, `input_${variable}`, javascriptGenerator.ORDER_ATOMIC)
  })
  const template = ((block.text_template.template as string).replace(/\$\{([^}]+)\}/g,(match,variable)=>{
    return `\${${values[variables.indexOf(variable)]}}`
  }) as any).replaceAll("\n","\\n").replaceAll("`","\\`")
  return [`\`${template}\``,javascriptGenerator.ORDER_ATOMIC]
}

export const TextBlocks = [
  TemplateStringBlock,
  RegularBlock
]

export const textBlockGenerators = {
  "regular":regularBlockGenerator,
  "template_string":templateStringBlockGenerator
}
