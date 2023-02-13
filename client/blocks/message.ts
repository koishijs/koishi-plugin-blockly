import {javascriptGenerator} from "blockly/javascript";

export const SendSessionMessageBlock = {
  "type": "send_session_message",
  "message0": "发送消息给事件发送者 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "content",
      "check": [
        "Boolean",
        "String"
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function sendSessionMessageBlock(block){
  let value_name = javascriptGenerator.valueToCode(block, 'content', javascriptGenerator.ORDER_ATOMIC);
  return `await session.send(${value_name});\n`;
}

export const ReturnMessageBlock = {
  "type": "return_message",
  "message0": "终止后续逻辑并发送消息 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "content",
      "check": [
        "Boolean",
        "String"
      ]
    }
  ],
  "previousStatement": null,
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function returnMessageBlock(block){
  let value_name = javascriptGenerator.valueToCode(block, 'content', javascriptGenerator.ORDER_ATOMIC);
  return `return ${value_name};\n`;
}

export const MessageBlocks = [
  SendSessionMessageBlock,
  ReturnMessageBlock
]

export const messageBlocks = {
  'send_session_message':sendSessionMessageBlock,
  'return_message':returnMessageBlock
}
