import {javascriptGenerator} from "blockly/javascript";

export const DeleteMessage = {
  "type": "delete_message",
  "message0": "撤回消息 %1 机器人对象 %2 消息ID %3 频道ID %4",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "bot"
    },
    {
      "type": "input_value",
      "name": "message_id"
    },
    {
      "type": "input_value",
      "name": "channel_id"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function deleteMessage(block){
  let bot = javascriptGenerator.valueToCode(block, 'bot', javascriptGenerator.ORDER_ATOMIC)
  let message_id = javascriptGenerator.valueToCode(block, 'message_id', javascriptGenerator.ORDER_ATOMIC)
  let channel_id = javascriptGenerator.valueToCode(block, 'channel_id', javascriptGenerator.ORDER_ATOMIC)
  return `await ${bot}.deleteMessage(${channel_id},${message_id});\n`
}

export const MuteUser = {
  "type": "mute_user",
  "message0": "禁言用户 %1 机器人对象 %2 用户ID %3 群组ID %4 禁言时间(毫秒) %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "bot"
    },
    {
      "type": "input_value",
      "name": "user_id"
    },
    {
      "type": "input_value",
      "name": "guild_id"
    },
    {
      "type": "input_value",
      "name": "time"
    }
  ],
  "inputsInline": false,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function muteUser(block){
  let bot = javascriptGenerator.valueToCode(block, 'bot', javascriptGenerator.ORDER_ATOMIC)
  let user_id = javascriptGenerator.valueToCode(block, 'user_id', javascriptGenerator.ORDER_ATOMIC)
  let guild_id = javascriptGenerator.valueToCode(block, 'guild_id', javascriptGenerator.ORDER_ATOMIC)
  let time = javascriptGenerator.valueToCode(block, 'time', javascriptGenerator.ORDER_ATOMIC)
  return `await ${bot}.muteGuildMember(${guild_id},${user_id},${time});\n`
}

export const BotBlocks = [
  DeleteMessage,
  MuteUser
]

export const botBlocks = {
  'delete_message':deleteMessage,
  'mute_user':muteUser
}
