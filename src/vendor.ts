import {DataService} from "@koishijs/plugin-console";
import {Dict} from "koishi";

declare module '@koishijs/plugin-console' {
  namespace Console{
    interface Services {
      'blocklyEditor': BlocklyEditorService
    }
  }
  interface Context{
    'blocklyEditor': BlocklyEditorService
  }
}

export type BlocklyEditorService = {
  register(service:string,blocks:any[]):void;
}

