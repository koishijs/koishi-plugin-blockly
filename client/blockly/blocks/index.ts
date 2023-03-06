
import {DataBlocks, dataBlockGenerators} from "./data";
import {ParameterBlocks} from "./parameter";
import {SessionBlocks, sessionBlockGenerators} from "./session";
import {botBlockGenerators, BotBlocks} from "./bot";
import {debugBlockGenerators, DebugBlocks} from "./debugging";
import {eventBlockGenerators, EventBlocks} from "./event";
import {environmentBlockGenerators, EnvironmentBlocks} from "./environment";
import {textBlockGenerators, TextBlocks} from "./text";
import {logicalBlocks, LogicalBlocks} from "./logic";
import {messageBlocks, MessageBlocks} from "./message";
import {segmentBlockGenerators, SegmentBlocks} from "./segment";
import {numberBlockGenerators, NumberBlocks} from "./number";
import {TypeBlocks} from "./typing";

export const Blocks = [
  ...LogicalBlocks,
  ...TextBlocks,
  ...EventBlocks,
  ...SessionBlocks,
  ...MessageBlocks,
  ...SegmentBlocks,
  ...DataBlocks,
  ...BotBlocks,
  ...DebugBlocks,
  ...EnvironmentBlocks,
  ...ParameterBlocks,
  ...NumberBlocks,
  ...TypeBlocks
]

export const BlockGenerators=Object.assign({},...[
  logicalBlocks,
  textBlockGenerators,
  eventBlockGenerators,
  sessionBlockGenerators,
  messageBlocks,
  segmentBlockGenerators,
  dataBlockGenerators,
  botBlockGenerators,
  debugBlockGenerators,
  environmentBlockGenerators,
  numberBlockGenerators
])
