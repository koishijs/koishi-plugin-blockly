import {DataService} from "@koishijs/plugin-console";
import {Dict} from "koishi";

declare module '@koishijs/plugin-console' {
  namespace Console{
    interface Services {
      'blockly_vendors': BlocklyVendorDataService
    }
  }
}

export interface BlockDefinition {
  type: string
  definition: any
}

export interface BlocklyVendor{
  id:string
  blocks:BlockDefinition[]
}

export class BlocklyVendorDataService extends DataService<Dict<BlocklyVendor>>{

  constructor(ctx) {
    super(ctx,'blockly_vendors');
  }

  async get() {
    return this.ctx.blockly.vendors
  }
}
