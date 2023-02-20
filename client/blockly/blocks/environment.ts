import {javascriptGenerator} from "blockly/javascript";
export const TimestampBlock = {
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

export function timestampBlockGenerator(block) {
    let timestamp_type = block.getFieldValue('type');
    return [`Math.round(new Date() ${ timestamp_type === "11" ? " / 1000" : "" })`, javascriptGenerator.ORDER_NONE];
}

export const TimeFormatBlock = {
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
    "imports":{koishi:['Time']},
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
  }
export function timeFormatBlockGenerator(block) {
    var text_date = javascriptGenerator.valueToCode(block, 'date', javascriptGenerator.ORDER_ATOMIC);
    var text_fmt = block.getFieldValue('fmt');
    return [`Time.template('${text_fmt}',new Date(${text_date}))`, javascriptGenerator.ORDER_NONE];
}

export const PluginIdBlock = {
    "type": "plugin_id",
    "message0": "当前插件ID",
    "output": null,
    "colour": 230,
    "tooltip": "",
    "template":["plugin_id"],
    "helpUrl": ""
}

export function pluginIdBlockGenerator(block) {
    return [`pluginId`, javascriptGenerator.ORDER_NONE];
}

export const EnvironmentBlocks = [
    TimestampBlock,
    TimeFormatBlock,
    PluginIdBlock
]

export const environmentBlockGenerators = {
   'time_stamp':timestampBlockGenerator,
   'time_format':timeFormatBlockGenerator,
   'plugin_id':pluginIdBlockGenerator
}
