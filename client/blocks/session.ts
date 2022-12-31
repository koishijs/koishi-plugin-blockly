import * as Blockly from 'blockly'
import {javascriptGenerator} from 'blockly/javascript'
export const SendSessionMessageBlock = {
  "type": "send_session_message",
  "message0": "发送消息给事件发送者 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
      "check": [
        "Boolean",
        "String"
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function sendSessionMessageBlock(block){
  var value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
  var code = `await session.send(${value_name});\n`;
  return code;
}

export const BreakMiddlewareBlock = {
  "type": "break_middleware",
  "message0": "终止后续逻辑执行",
  "previousStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function breakMiddlewareBlock(block){
  return 'return null;\n';
}


export const ReturnMessageBlock = {
  "type": "return_message",
  "message0": "终止后续逻辑并发送消息 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "NAME",
      "check": [
        "Boolean",
        "String"
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function returnMessageBlock(block){
  var value_name = javascriptGenerator.valueToCode(block, 'NAME', javascriptGenerator.ORDER_ATOMIC);
  var code = `return ${value_name};\n`;
  return code;
}


