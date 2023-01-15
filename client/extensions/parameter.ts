import {Mutator} from "blockly";
import * as Blockly from "blockly";

export function parameterListMutator(){
  Blockly.Extensions.registerMutator('parameter_list', {
    decompose: function(workspace) {
      let topBlock = workspace.newBlock('parameter_list');
      topBlock.initSvg();
      return topBlock;
    },

    compose: function(topBlock) {

    },
    saveExtraState: function() {
      return {
        'itemCount': this.itemCount_,
      };
    },

    loadExtraState: function(state) {
      this.itemCount_ = state['itemCount'];
    }
  }, undefined, ['any_parameter','string_parameter','number_parameter','boolean_parameter','int_parameter']);
}
