import {Service} from "koishi";
import jsonPath from 'jsonpath'
export class BlocklyService extends Service{
  constructor(ctx) {
    super(ctx,'blockly');
  }
  async json_parse(v,t){
    try{
      return await jsonPath.query(v,t)
    }catch(e){
      this.ctx.logger('blockly-lib').warn("Failed to read the object:"+e.toString())
      return undefined
    }
  }
}
