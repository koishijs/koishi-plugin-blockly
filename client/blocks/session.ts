import {javascriptGenerator} from 'blockly/javascript'

export const GetArgument = {
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

export function getArgument(block){
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

export function breakMiddlewareBlock(){
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

export function sessionMessageBlock(){
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

export function sessionUserIdBlock(){
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

export function sessionBotBlock(){
  return [`session.bot`,javascriptGenerator.ORDER_NONE];
}

export const SessionGuildId = {
  "type": "session_guild_id",
  "message0": "消息来自的群组编号",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionChannelId(){
  return [`session.channelId`,javascriptGenerator.ORDER_NONE];
}

export const SessionChannelId = {
  "type": "session_channel_id",
  "message0": "消息来自的频道编号(群号)",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionGuildId(){
  return [`session.guildId`,javascriptGenerator.ORDER_NONE];
}

export const SessionMessageId = {
  "type": "session_message_id",
  "message0": "消息编号",
  "output": "String",
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function sessionMessageId(){
  return [`session.messageId`,javascriptGenerator.ORDER_NONE];
}

export const SessionBlocks = [
  GetArgument,
  BreakMiddlewareBlock,
  SessionMessageBlock,
  SessionUserIdBlock,
  SessionChannelId,
  SessionGuildId,
  SessionMessageId,
  SessionBotBlock
]

export const sessionBlocks = {
  'get_argument':getArgument,
  'break_middleware':breakMiddlewareBlock,
  'session_message':sessionMessageBlock,
  'session_user_id':sessionUserIdBlock,
  'session_channel_id':sessionChannelId,
  'session_guild_id':sessionGuildId,
  'session_message_id':sessionMessageId,
  'session_bot':sessionBotBlock,
}
