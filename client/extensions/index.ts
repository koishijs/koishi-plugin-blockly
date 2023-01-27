import {parameterListMutator} from "./parameter";
import {registerScopeExtensions} from "./scope";

export function registerExtensions(){
  parameterListMutator();
  registerScopeExtensions()
}
