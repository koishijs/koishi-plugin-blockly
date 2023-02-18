import {javascriptGenerator} from "blockly/javascript";
export const LoggingBlock = {
  "type": "logging",
  "message0": "输出一个 %1 级别的日志 %2",
  "args0": [
  {
    "type": "field_dropdown",
    "name": "level",
    "options": [
      [
        "调试",
        "debug"
      ],
      [
        "提示",
        "info"
      ],
      [
        "警告",
        "warn"
      ],
      [
        "成功",
        "success"
      ],
      [
        "错误",
        "error"
      ]
    ]
  },
  {
    "type": "input_value",
    "name": "log"
  }
],
  "template":['logger_initialize'],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}
const loggingBlockGenerator = function(block) {
  var dropdown_level = block.getFieldValue('level');
  var log = javascriptGenerator.valueToCode(block, 'log', javascriptGenerator.ORDER_ATOMIC)
  return `logger.${dropdown_level}(${log});\n`;
};

export const DebugBlocks = [
  LoggingBlock
]

export const debugBlockGenerators = {
  'logging':loggingBlockGenerator
}
