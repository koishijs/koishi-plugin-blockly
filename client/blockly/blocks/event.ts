import {javascriptGenerator} from "blockly/javascript";

export const MiddlewareBlock = {
  "type": "middleware",
  "message0": "当接受到聊天消息 %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "callback"
    }
  ],
  "extensions":['session_provider'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function middlewareBlockGenerator(block){
  let statements_callback = javascriptGenerator.statementToCode(block, 'callback');
  return `ctx.middleware(async (session,next)=>{\n${statements_callback}  return next();\n})`
}

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

export function eventBlockGenerator(block){
  var dropdown_event_name = block.getFieldValue('event_name')
  var statements_listener = javascriptGenerator.statementToCode(block, 'listener')
  return `ctx.on('${dropdown_event_name}',async (session)=>{\n${statements_listener}\n})`
}

export const PluginApplyBlock = {
  "type":"plugin_apply",
  "message0":"当启用插件时 %1 执行 %2",
  "args0":[
    {
      "type":"input_dummy"
    },
    {
      "type":"input_statement",
      "name":"apply"
    }
  ],
  "inputsInline": false,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function pluginApplyBlockGenerator(block){
  return javascriptGenerator.statementToCode(block, 'apply')
}

export const CommandBlock = {
  "type": "command",
  "message0": "创建一个新的指令 %1 %2 调用函数 %3",
  "args0": [
    {
      "type": "field_input",
      "name": "name",
      "text": "指令名称"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "action"
    }
  ],
  "mutator":"parameter_list",
  "extensions":['session_provider','argument_provider'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
};
export function commandBlockGenerator(block){
  let text_name = block.getFieldValue('name');
  let parameters = block.parameters ?? []
  let statements_action = javascriptGenerator.statementToCode(block, 'action');
  let command_definition = text_name + ' ' + parameters.map((parameter)=>{
    const {required,name,type} = parameter

    return (required?'<':'[') + name + (type!='any_parameter'?':'+type.split('_')[0]:'') + (required?'>':']')
  }).join(' ')
  return `ctx.command('${command_definition}').action(async ({session},...args)=>{\n${statements_action}\n});\n`;
}

export const EventBlocks = [
  MiddlewareBlock,
  OnMessageEvent,
  OnGuildMemberEvent,
  OnGuildEvent,
  PluginApplyBlock,
  CommandBlock
]

export const eventBlockGenerators = {
  'middleware':middlewareBlockGenerator,
  'command':commandBlockGenerator,
  'plugin_apply':pluginApplyBlockGenerator,
  'on_message_event':eventBlockGenerator,
  'on_guild_member_event':eventBlockGenerator,
  'on_guild_event':eventBlockGenerator
}
