export interface BlocklyDocument{
  id:number
  name:string
  body:string
  code:string
  enabled:boolean
  edited:boolean
}

declare module "koishi"{
  interface Tables{
    blockly:BlocklyDocument
  }
}

export interface BlocklyMenuItem{
  id:number
  name:string
  enabled:boolean
  edited:boolean
}

