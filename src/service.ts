import {Service} from "koishi";
import {JSONPath} from 'jsonpath-plus';
export class BlocklyService extends Service{
  constructor(ctx) {
    super(ctx,'blockly');
  }
  async json_parse(v,t){
    try {
      return await JSONPath({path:t,json:v})
    }catch(e){
      this.ctx.logger('blockly-lib').warn("Failed to read the object:"+e.toString())
      return undefined
    }
  }
}
