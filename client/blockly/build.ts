import WrapperTemplate from './template.js.tpl?raw'
import {javascriptGenerator} from "blockly/javascript";
import {deduplicate} from "cosmokit"
import {Workspace} from "blockly";
import {Dict, } from "cosmokit";
export function createWrapper(imports:Dict<any>,name="",using=[],apply=""){
  return [...Object.entries(imports)].map(([i,j])=>
      `import { ${j.join(', ')} } from "${i}"\n`
    ).join("")+
    WrapperTemplate
    .replace(/\{\{name}}/g,name.replace(/"/g,"\\\"").replace(/\\/g,"\\\\"))
    .replace(/\{\{using}}/g,JSON.stringify(using))
    .replace(/\{\{apply}}/g,apply.split("\n").map(t=>"  "+t).join("\n"))
}
export function build(name,workspace:Workspace){
  let currentImportMap = {}
  workspace.getAllBlocks(false).filter(b=>b['imports']).map(b=>b['imports']).forEach(t=>{
    [...Object.entries(t)].forEach(([i,j])=>{
      if(!currentImportMap[i]) currentImportMap[i] = []
      currentImportMap[i] = deduplicate([...currentImportMap[i],...j as any])
    })
  })
  return createWrapper(currentImportMap,name,[],javascriptGenerator.workspaceToCode(workspace))
}
