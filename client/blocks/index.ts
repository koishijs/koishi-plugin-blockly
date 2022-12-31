import {middlewareBlock, MiddlewareBlock} from "./processing";
import {
  breakMiddlewareBlock,
  BreakMiddlewareBlock, ReturnMessageBlock,
  returnMessageBlock,
  sendSessionMessageBlock,
  SendSessionMessageBlock
} from "./session";

export const Blocks = [
  MiddlewareBlock,
  SendSessionMessageBlock,
  BreakMiddlewareBlock,
  ReturnMessageBlock
]

export const BlockGenerators={
  'middleware':middlewareBlock,
  'send_session_message':sendSessionMessageBlock,
  'break_middleware':breakMiddlewareBlock,
  'return_message':returnMessageBlock
}
