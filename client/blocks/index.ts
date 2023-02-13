
import {DataBlocks, dataBlocks} from "./data";
import {ParameterBlocks} from "./parameter";
import {SessionBlocks, sessionBlocks} from "./session";
import {botBlocks, BotBlocks} from "./bot";
import {debugBlocks, DebugBlocks} from "./debugging";
import {eventBlocks, EventBlocks} from "./event";
import {environmentBlocks, EnvironmentBlocks} from "./environment";
import {stringBlocks, StringBlocks} from "./string";
import {logicalBlocks, LogicalBlocks} from "./logic";
import {messageBlocks, MessageBlocks} from "./message";
import {segmentBlocks, SegmentBlocks} from "./segment";

export const Blocks = [
  ...LogicalBlocks,
  ...StringBlocks,
  ...EventBlocks,
  ...SessionBlocks,
  ...MessageBlocks,
  ...SegmentBlocks,
  ...DataBlocks,
  ...BotBlocks,
  ...DebugBlocks,
  ...EnvironmentBlocks,
  ...ParameterBlocks,
]

export const BlockGenerators=Object.assign({},...[
  logicalBlocks,
  stringBlocks,
  eventBlocks,
  sessionBlocks,
  messageBlocks,
  segmentBlocks,
  dataBlocks,
  botBlocks,
  debugBlocks,
  environmentBlocks,
])
