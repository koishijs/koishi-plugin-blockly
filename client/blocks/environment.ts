import {javascriptGenerator} from "blockly/javascript";
export const TimeStamp = {
    "type": "time_stamp",
    "message0": "%1 时间戳",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "type",
        "options": [
          [
            "11位",
            "11"
          ],
          [
            "13位",
            "13"
          ]
        ]
      }
    ],
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }

export function timeStamp(block) {
    let timestamp_type = block.getFieldValue('type');
    return [`Math.round(new Date() ${ timestamp_type === "11" ? " / 1000" : "" })`, javascriptGenerator.ORDER_NONE];
}

export const EnvironmentBlocks = [
    TimeStamp
  ]
  
  export const environmentBlocks = {
    'time_stamp':timeStamp
  }