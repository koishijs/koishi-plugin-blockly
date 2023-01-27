import {javascriptGenerator} from 'blockly/javascript'
export const CommandBlock = {
  "type": "command",
  "message0": "创建一个新的指令 %1 %2 调用函数 %3",
  "args0": [
    {
      "type": "field_input",
      "name": "name",
      "text": "指令名称"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "action"
    }
  ],
  "mutator":"parameter_list",
  "extensions":['session_provider','argument_provider'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};
export function commandBlock(block){
  let text_name = block.getFieldValue('name');
  let parameters = block.parameters ?? []
  let statements_action = javascriptGenerator.statementToCode(block, 'action');
  let command_definition = text_name + ' ' + parameters.map((parameter)=>{
    const {required,name,type} = parameter

    return (required?'<':'[') + name + (type!='any_parameter'?':'+type.split('_')[0]:'') + (required?'>':']')
  }).join(' ')
  return `ctx.command('${command_definition}').action(async ({session},...args)=>{\n${statements_action};\n});\n`;
}

export const CommandBlocks = [
  CommandBlock
]

export const commandBlocks = {
  'command':commandBlock
}
