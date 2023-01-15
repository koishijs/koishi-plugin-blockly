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
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};
export function commandBlock(block){
  let text_name = block.getFieldValue('name');
  let statements_action = javascriptGenerator.statementToCode(block, 'action');
  return `ctx.command('${text_name}').action(async ({session})=>{\n${statements_action};\n});\n`;
}
