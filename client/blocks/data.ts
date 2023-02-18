import {javascriptGenerator} from "blockly/javascript";
import {BlockSvg} from "blockly";

export const HttpGetBlock = {
  "type": "http_get",
  "message0": "发送简单HTTP GET请求 %1 网址 %2 返回类型 %3",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "url"
    },
    {
      "type": "field_dropdown",
      "name": "response_type",
      "options": [
        [
          "默认类型",
          ""
        ],
        [
          "JSON对象类型",
          "json"
        ],
        [
          "文本类型",
          "text"
        ]
      ]
    }
  ],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function httpGetBlockGenerator(block:BlockSvg){
  let value_url = javascriptGenerator.valueToCode(block, 'url', javascriptGenerator.ORDER_ATOMIC);
  let response_type = block.getFieldValue('response_type');
  return [`await ctx.http.get(${value_url},{responseType:"${response_type}"})`, javascriptGenerator.ORDER_NONE];
}

export const JsonPathParseBlock = {
  "type": "json_path_parse",
  "message0": "解析JSON对象 %1 JSONPath %2",
  "args0": [
    {
      "type": "input_value",
      "name": "value"
    },
    {
      "type": "field_input",
      "name": "path",
      "text": "$"
    }
  ],
  "inputsInline": false,
  "imports":{'jsonpath-plus':['JSONPath as parseJson']},
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function jsonPathBlockGenerator(block:BlockSvg){
  let value_value = javascriptGenerator.valueToCode(block, 'value', javascriptGenerator.ORDER_ATOMIC);
  let text_path = block.getFieldValue('path');
  return [`await parseJson(${value_value},"${text_path}")`, javascriptGenerator.ORDER_NONE];
}

export const KeyValueWriteBlock = {
  "type": "key_value_write",
  "message0": "写入键值对 键 %1 值 %2",
  "args0": [
    {
      "type": "input_value",
      "name": "key"
    },
    {
      "type": "input_value",
      "name": "value",
      "align": "RIGHT"
    }
  ],
  "template":["key_value_initialize"],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function keyValueWriteBlockGenerator(block:BlockSvg){
  let value_key = javascriptGenerator.valueToCode(block, 'key', javascriptGenerator.ORDER_ATOMIC);
  let value_value = javascriptGenerator.valueToCode(block, 'value', javascriptGenerator.ORDER_ATOMIC);
  return `await ctx.database.upsert('blockly_key_value',[{key:${value_key},value:${value_value}}],['key'])\n`;
}

export const KeyValueReadBlock = {
  "type": "key_value_read",
  "message0": "读取键值对 键 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "key"
    }
  ],
  "template":["key_value_initialize"],
  "inputsInline": false,
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function keyValueReadBlockGenerator(block:BlockSvg){
  let value_key = javascriptGenerator.valueToCode(block, 'key', javascriptGenerator.ORDER_ATOMIC);
  return [`(await ctx.database.get('blockly_key_value',{key:${value_key}}))[0]?.value`, javascriptGenerator.ORDER_NONE];
}


export const DataBlocks = [
  HttpGetBlock,
  JsonPathParseBlock,
  KeyValueWriteBlock,
  KeyValueReadBlock
]

export const dataBlockGenerators = {
  'http_get':httpGetBlockGenerator,
  'json_path_parse':jsonPathBlockGenerator,
  'key_value_write':keyValueWriteBlockGenerator,
  'key_value_read':keyValueReadBlockGenerator
}
