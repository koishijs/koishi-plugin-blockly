import WrapperTemplate from './template.js.tpl?raw'
export function createWrapper(name="",using=[],apply=""){
  return WrapperTemplate
    .replace(/\{\{name}}/g,name.replace(/"/g,"\\\"").replace(/\\/g,"\\\\"))
    .replace(/\{\{using}}/g,JSON.stringify(using))
    .replace(/\{\{apply}}/g,apply.split("\n").map(t=>"    "+t).join("\n"))

}
