import {CommandBlocks, commandBlocks} from "./command";
import {NetworkingBlocks, networkingBlocks} from "./networking";
import {ParameterBlocks, parameterBlocks} from "./parameter";
import {ProcessingBlocks, processingBlocks} from "./processing";
import {SessionBlocks, sessionBlocks} from "./session";
import {botBlocks, BotBlocks} from "./bot";
import {debugBlocks, DebugBlocks} from "./debugging";

export const Blocks = [
  ...CommandBlocks,
  ...NetworkingBlocks,
  ...ParameterBlocks,
  ...ProcessingBlocks,
  ...SessionBlocks,
  ...BotBlocks,
  ...DebugBlocks
]

export const BlockGenerators=Object.assign({},...[
  commandBlocks,
  networkingBlocks,
  parameterBlocks,
  processingBlocks,
  sessionBlocks,
  botBlocks,
  debugBlocks
])
