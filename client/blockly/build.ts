import WrapperTemplate from './template.js.tpl?raw'
import {javascriptGenerator} from "blockly/javascript";
import {deduplicate} from "cosmokit"
import {Workspace} from "blockly";
import {Dict, } from "cosmokit";
import {TemplateCodes} from "./template";
export function createWrapper(imports:Dict<any>,name="",using=[],apply=""){
  return [...Object.entries(imports)].map(([i,j])=>
      `import { ${j.join(', ')} } from "${i}"\n`
    ).join("")+
    WrapperTemplate
    .replace(/\{\{name}}/g,name.replace(/"/g,"\\\"").replace(/\\/g,"\\\\"))
    .replace(/\{\{using}}/g,JSON.stringify(using))
    .replace(/\{\{apply}}/g,apply.split("\n").map(t=>"  "+t).join("\n"))
}
export function build(name,plugin_id,workspace:Workspace){
  let currentImportMap = {}
  const blocks = workspace.getAllBlocks(false)
  blocks.filter(b=>b['imports']).map(b=>b['imports']).forEach(t=>{
    [...Object.entries(t)].forEach(([i,j])=>{
      if(!currentImportMap[i]) currentImportMap[i] = []
      currentImportMap[i] = deduplicate([...currentImportMap[i],...j as any])
    })
  })
  const templates = [];
  blocks.filter(b=>b['template']).map(b=>b['template']).forEach(t=>{
    t.forEach(t=>{
      if(!templates.includes(t)) templates.push(t)
    })
  })

  return createWrapper(currentImportMap,name,[],templates.map(t=>TemplateCodes[t]+"\n").map(t=>t.replace('{{name}}',name).replace("{{plugin_id}}",plugin_id)).join("")+javascriptGenerator.workspaceToCode(workspace))
}
