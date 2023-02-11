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
  
  async date_format(t, f){
    var o = {
      "M+": t.getMonth() + 1,
      "d+": t.getDate(),
      "h+": t.getHours(),
      "m+": t.getMinutes(),
      "s+": t.getSeconds(),
      "q+": Math.floor((t.getMonth() + 3) / 3),
      "S": t.getMilliseconds()
    };
    if (/(y+)/.test(f)) {
      f = f.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(f)) {
        f = f.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return await f;
  }
}
