import {javascriptGenerator} from 'blockly/javascript'

export const MiddlewareBlock = {
  "type": "middleware",
  "message0": "当接受到聊天消息 %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "callback"
    }
  ],
  "extensions":['session_provider'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function middlewareBlock(block){
  let statements_callback = javascriptGenerator.statementToCode(block, 'callback');
  return `ctx.middleware(async (session,next)=>{\n${statements_callback};\nreturn next();\n})`
}
