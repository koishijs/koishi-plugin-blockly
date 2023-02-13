import {javascriptGenerator} from 'blockly/javascript'

export const GetArgumentBlock = {
  "type": "get_argument",
  "message0": "第 %1 个参数",
  "args0": [
    {
      "type": "field_number",
      "name": "id",
      "value": 0
    }
  ],
  "output": "String",
  "extensions":["argument_consumer"],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function getArgumentBlockGenerator(block){
  let argument_id = block.getFieldValue('id');
  return [`args[${argument_id}]`,javascriptGenerator.ORDER_NONE]
}

export const BreakMiddlewareBlock = {
  "type": "break_middleware",
  "message0": "终止后续逻辑执行",
  "previousStatement": null,
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};

export function breakMiddlewareBlockGenerator(){
  return 'return null;\n';
}

export const SessionMessageBlock = {
  "type": "session_message",
  "message0": "发送消息的内容",
  "extensions":['session_consumer'],
  "output": "String",
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionMessageBlockGenerator(){
  return [`session.content`,javascriptGenerator.ORDER_NONE];
}


export const SessionUserIdBlock = {
  "type": "session_user_id",
  "message0": "发送消息用户的平台用户ID",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionUserIdBlockGenerator(){
  return [`session.userId`,javascriptGenerator.ORDER_NONE];
}

export const SessionBotBlock = {
  "type": "session_bot",
  "message0": "收到消息的机器人对象",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionBotBlockGenerator(){
  return [`session.bot`,javascriptGenerator.ORDER_NONE];
}

export const SessionGuildIdBlock = {
  "type": "session_guild_id",
  "message0": "消息来自的群组编号",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionChannelIdBlockGenerator(){
  return [`session.channelId`,javascriptGenerator.ORDER_NONE];
}

export const SessionChannelIdBlock = {
  "type": "session_channel_id",
  "message0": "消息来自的频道编号(群号)",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionGuildIdBlockGenerator(){
  return [`session.guildId`,javascriptGenerator.ORDER_NONE];
}

export const SessionMessageIdBlock = {
  "type": "session_message_id",
  "message0": "消息编号",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionMessageIdBlockGenerator(){
  return [`session.messageId`,javascriptGenerator.ORDER_NONE];
}

export const SessionBlocks = [
  GetArgumentBlock,
  BreakMiddlewareBlock,
  SessionMessageBlock,
  SessionUserIdBlock,
  SessionChannelIdBlock,
  SessionGuildIdBlock,
  SessionMessageIdBlock,
  SessionBotBlock
]

export const sessionBlockGenerators = {
  'get_argument':getArgumentBlockGenerator,
  'break_middleware':breakMiddlewareBlockGenerator,
  'session_message':sessionMessageBlockGenerator,
  'session_user_id':sessionUserIdBlockGenerator,
  'session_channel_id':sessionChannelIdBlockGenerator,
  'session_guild_id':sessionGuildIdBlockGenerator,
  'session_message_id':sessionMessageIdBlockGenerator,
  'session_bot':sessionBotBlockGenerator,
}
