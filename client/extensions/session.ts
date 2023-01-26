import * as Blockly from "blockly";

export function sessionExtension(){
  Blockly.Extensions.registerMixin('session', {
    is_session_block:true
  })
}

export function sessionProviderExtension(){
  Blockly.Extensions.registerMixin('session_provider', {
    is_session_provider:true
  })
}
