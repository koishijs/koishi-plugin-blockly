import {javascriptGenerator} from "blockly/javascript";

export const SleepBlock = {
  "type": "sleep",
  "message0": "等待 %1 毫秒",
  "args0": [
    {
      "type": "input_value",
      "name": "milliseconds",
      "check": [
        "Number"
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function sleepBlockGenerator(block){
  let value_name = javascriptGenerator.valueToCode(block, 'milliseconds', javascriptGenerator.ORDER_ATOMIC);
  return `await new Promise(resolve => ctx.setTimeout(resolve, ${value_name}));\n`;
}

export const LogicalBlocks = [
  SleepBlock
]

export const logicalBlocks = {
  sleep: sleepBlockGenerator
}
