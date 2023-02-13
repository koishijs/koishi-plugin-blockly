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
            "13位",
            "13"
          ],
          [
            "11位",
            "11"
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

export const TimeFormat = {
    "type": "time_format",
    "message0": "日期时间格式 %1 13位时间戳 %2",
    "args0": [
      {
        "type": "field_input",
        "name": "fmt",
        "text": "yyyy-MM-dd hh:mm:ss"
      },
      {
        "type": "input_value",
        "name": "date"
      }
    ],
    "output": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
export function timeFormat(block) {
    var text_date = javascriptGenerator.valueToCode(block, 'date', javascriptGenerator.ORDER_ATOMIC);
    var text_fmt = block.getFieldValue('fmt');
    return [`await ctx.blockly.date_format(new Date(${text_date}),'${text_fmt}')`, javascriptGenerator.ORDER_NONE];
}

export const EnvironmentBlocks = [
    TimeStamp,
    TimeFormat
]

export const environmentBlocks = {
   'time_stamp':timeStamp,
   'time_format':timeFormat
}
