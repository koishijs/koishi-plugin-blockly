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
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function segmentAtBlockGenerator(block){
  let user = javascriptGenerator.valueToCode(block, 'user', javascriptGenerator.ORDER_ATOMIC);
  return [`segment.at(${user})`,javascriptGenerator.ORDER_NONE];
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
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function segmentImageBlockGenerator(block){
  let image = javascriptGenerator.valueToCode(block, 'image', javascriptGenerator.ORDER_ATOMIC);
  return [`segment.image(${image})`,javascriptGenerator.ORDER_NONE];
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
  "extensions":['session_consumer'],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}

export function segmentAudioBlockGenerator(block){
  let audio = javascriptGenerator.valueToCode(block, 'audio', javascriptGenerator.ORDER_ATOMIC);
  return [`segment.audio(${audio})`,javascriptGenerator.ORDER_NONE]
}

export const SegmentBlocks = [
  SegmentAtBlock,
  SegmentImageBlock,
  SegmentAudioBlock
]

export const segmentBlockGenerators = {
  'segment_at':segmentAtBlockGenerator,
  'segment_image':segmentImageBlockGenerator,
  'segment_audio':segmentAudioBlockGenerator
}
