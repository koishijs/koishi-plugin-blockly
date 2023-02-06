import {javascriptGenerator} from "blockly/javascript";

export const OnMessageEvent = {
  "type": "on_message_event",
  "message0": "当消息 %1 %2 运行 %3",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "event_name",
      "options": [
        [
          "被删除(撤回)",
          "message-deleted"
        ],
        [
          "消息被修改",
          "message-updated"
        ],
        [
          "被机器人发送",
          "send"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "listener"
    }
  ],
  "extensions":['session_provider'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export const OnGuildMemberEvent = {
  "type": "on_guild_member_event",
  "message0": "当群组成员 %1 %2 运行 %3",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "event_name",
      "options": [
        [
          "加入",
          "guild-member-added"
        ],
        [
          "退出/踢出",
          "guild-member-deleted"
        ],
        [
          "申请加入",
          "guild-member-request"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "listener"
    }
  ],
  "extensions":['session_provider'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export const OnGuildEvent = {
  "type": "on_guild_event",
  "message0": "当你的机器人 %1 群组 %2 运行 %3",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "event_name",
      "options": [
        [
          "加入",
          "guild-added"
        ],
        [
          "退出/被踢出",
          "guild-deleted"
        ],
        [
          "被邀请到一个",
          "guild-request"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "listener"
    }
  ],
  "extensions":['session_provider'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function eventBlockBuilder(block){
  var dropdown_event_name = block.getFieldValue('event_name')
  var statements_listener = javascriptGenerator.statementToCode(block, 'listener')
  return `ctx.on('${dropdown_event_name}',async (session)=>{\n${statements_listener}\n})`
}

export const EventBlocks = [
  OnMessageEvent,
  OnGuildMemberEvent,
  OnGuildEvent
]

export const eventBlocks = {
  'on_message_event':eventBlockBuilder,
  'on_guild_member_event':eventBlockBuilder,
  'on_guild_event':eventBlockBuilder
}
