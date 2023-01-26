import {parameterListMutator} from "./parameter";
import {sessionExtension, sessionProviderExtension} from "./session";

export function registerExtensions(){
  parameterListMutator();
  sessionExtension();
  sessionProviderExtension();
}
