import {parameterListMutator} from "./parameter";
import {consumerExtension, providerExtension, registerScopeExtensions} from "./scope";

export function registerExtensions(){
  parameterListMutator();
  registerScopeExtensions()
}
