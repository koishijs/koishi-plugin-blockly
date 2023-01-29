import {javascriptGenerator} from "blockly/javascript";

export const HttpGet = {
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

export function httpGet(block){
  let value_url = javascriptGenerator.valueToCode(block, 'url', javascriptGenerator.ORDER_ATOMIC);
  let response_type = block.getFieldValue('response_type');
  return [`await ctx.http.get(${value_url},{responseType:'${response_type}'})`, javascriptGenerator.ORDER_NONE];
}

export const JsonPathParse = {
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
  "output": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function jsonPathParse(block:BlockSvg){
  let value_value = javascriptGenerator.valueToCode(block, 'value', javascriptGenerator.ORDER_ATOMIC);
  let text_path = block.getFieldValue('path');
  return [`await ctx.blockly.json_parse(${value_value},'${text_path}')`, javascriptGenerator.ORDER_NONE];
}


export const NetworkingBlocks = [
  HttpGet,
  JsonPathParse
]

export const networkingBlocks = {
  'http_get':httpGet,
  'json_path_parse':jsonPathParse
}
