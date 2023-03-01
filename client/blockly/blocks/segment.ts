import {javascriptGenerator} from "blockly/javascript";

export const SegmentAtBlock = {
  "type": "segment_at",
  "message0": "@ %1",
  "args0": [
    {
      "type": "input_value",
      "name": "user",
      "check": "String"
    }
  ],
  "output": "String",
  "imports":{koishi:['h']},
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function segmentAtBlockGenerator(block){
  let user = javascriptGenerator.valueToCode(block, 'user', javascriptGenerator.ORDER_ATOMIC);
  return [`h('at',{ id: ${user} })`,javascriptGenerator.ORDER_NONE];
}

export const SegmentImageBlock = {
  "type": "segment_image",
  "message0": "图片 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "image",
      "check": "String"
    }
  ],
  "output": "String",
  "imports":{koishi:['h']},
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function segmentImageBlockGenerator(block){
  let image = javascriptGenerator.valueToCode(block, 'image', javascriptGenerator.ORDER_ATOMIC);
  return [`h('image',{ url: ${image} })`,javascriptGenerator.ORDER_NONE];
}

export const SegmentAudioBlock = {
  "type": "segment_audio",
  "message0": "语音 %1",
  "args0": [
    {
      "type": "input_value",
      "name": "audio",
      "check": "String"
    }
  ],
  "output": "String",
  "imports":{koishi:['h']},
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function segmentAudioBlockGenerator(block){
  let audio = javascriptGenerator.valueToCode(block, 'audio', javascriptGenerator.ORDER_ATOMIC);
  return [`h('audio',{ url: ${audio} })`,javascriptGenerator.ORDER_NONE]
}

export const ParseSegmentListBlock = {
  "type": "parse_segment_list",
  "message0": "解析消息元素列表 %1 对每个元素按顺序执行:",
  "args0": [
    {
      "type": "input_value",
      "name": "segments"
    }
  ],
  "colour": 230,
  "tooltip": "",
  "helpUrl": "",
  "inputsInline":false,
  "mutator": "segment_parser",
  "previousStatement": null,
  "nextStatement": null,
}

export function parseSegmentListBlockGenerator(block) {
  let segment = javascriptGenerator.valueToCode(block, 'segments', javascriptGenerator.ORDER_ATOMIC);
  let branches = block.inputList.filter(field => field.name.startsWith("branch_type_")).map(field => field.name.substring(12));
  let types = Object.fromEntries(branches.map(branch => [branch, block.getFieldValue(`branch_type_${branch}_selector`)]));
  let statements = Object.fromEntries(branches.map(branch => [branch, javascriptGenerator.statementToCode(block,`branch_action_${branch}`, javascriptGenerator.ORDER_ATOMIC)]));
  return `for(let current_segment of ${segment}){
  switch(segment.type){
    ${Object.entries(types).map(([branch, type]) => `case '${type}':
      ${statements[branch]}
        break;`).join('\n')}
  }
}`
}

export const currentSegmentBlock = {
  "type": "current_segment",
  "message0": "当前指向的消息元素",
  "output": null,
  "colour": 230,
  "tooltip": "",
}

export function currentSegmentBlockGenerator(block) {
  return ['current_segment', javascriptGenerator.ORDER_NONE];
}

export const SegmentBlocks = [
  SegmentAtBlock,
  SegmentImageBlock,
  SegmentAudioBlock,
  ParseSegmentListBlock,
  currentSegmentBlock
]

export const segmentBlockGenerators = {
  'segment_at':segmentAtBlockGenerator,
  'segment_image':segmentImageBlockGenerator,
  'segment_audio':segmentAudioBlockGenerator,
  'parse_segment_list':parseSegmentListBlockGenerator,
  'current_segment':currentSegmentBlockGenerator
}
