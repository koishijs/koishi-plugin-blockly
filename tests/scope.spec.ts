import { expect } from 'chai'
import { describe,it } from 'mocha'
import { Workspace } from "blockly";
import * as Blockly from "blockly";

// @ts-ignore
import {TestBlocks} from "./blocks";
// @ts-ignore
import {registerScope} from '../client/blockly/plugins/scope'

function assertCallbackExecuted(callback:Function){
  expect(callback).to.be.called
}

describe('Blockly Scope Manager',()=>{
  Blockly.defineBlocksWithJsonArray(TestBlocks)
  const workspace = new Workspace()
  registerScope(workspace)
  const provider = workspace.newBlock('test_scope_provider')
  const noop1 = workspace.newBlock('test_scope_noop')
  const noop2 = workspace.newBlock('test_scope_noop')
  const consumer = workspace.newBlock('test_scope_consumer')

  provider.getInput('NAME').connection.connect(noop1.previousConnection)
  noop1.getInput('NAME').connection.connect(noop2.previousConnection)
  noop2.getInput('NAME').connection.connect(consumer.previousConnection)



  it("Call the watch function when firstly using",(done)=>{
    provider.block_state.providing.push('test')
    let disposable
    disposable = consumer.block_state.using('test',()=>{
      disposable()
      done()
    })
  })

  it("Call the watch function when disconnect some nodes in the path",(done)=>{
    let counter = 0;
    const disposable = consumer.block_state.using('test',()=>{
      counter++;
      if(counter==2){
        noop2.getInput('NAME').connection.connect(consumer.previousConnection)
        disposable()
        done()
      }
    })
    setTimeout(()=>{
      noop2.getInput('NAME').connection.disconnect()
    })
  })

  it("Call the watch function when reconnect some nodes in the path",(done)=>{
    let counter = 0;
    const disposable = consumer.block_state.using('test',()=>{
      counter++;
      if(counter==3){
        disposable()
        done()
      }
    })
    setTimeout(()=>{
      noop2.getInput('NAME').connection.disconnect()
      setTimeout(()=>{
        noop2.getInput('NAME').connection.connect(consumer.previousConnection)
      })
    })
  })

})
