import {Connection, ConnectionChecker, IConnectionChecker, INPUT_VALUE, OUTPUT_VALUE, WorkspaceSvg} from 'blockly'
export {initializeType} from './overwritting'

export type TsTerminalType = string | number | boolean | undefined

export abstract class Type<P = any>{
  prototype:P = undefined as any

  constructor(...data:P extends never?[]:[P]) {
    if(data.length)
      this.prototype = data[0]
  }

  getPrototype(): P {
    return this.prototype;
  }

  abstract getTypeName():string
  abstract canWriteTo(target:Type):boolean
  abstract equalsTo(target:Type):boolean
  canWriteBy?(target:Type):boolean
}

export class ConstTerminalType<T extends TsTerminalType> extends Type<T>{

  getTypeName(): string {
    return 'const'
  }

  canWriteTo(target: Type) {
    return this.equalsTo(target) || target.getTypeName() == typeof this.getPrototype() || target.canWriteBy?.(this)
  }

  equalsTo(target: Type) {
    return target.getTypeName() == this.getTypeName() && target.getPrototype() == this.getPrototype()
  }
}

export abstract class TerminalType<T = never> extends Type<T>{

  canWriteTo(target: Type)  : boolean {
    return this.equalsTo(target) || target.canWriteBy?.(this)
  }

  abstract getTypeName(): string

  equalsTo(target: Type) {
    return target.getTypeName() == this.getTypeName()
  }

}

export class StringType extends TerminalType{
  getTypeName(): string {
    return "string";
  }
}

export class NumberType extends TerminalType{
  getTypeName(): string {
    return "number";
  }
}

export class BooleanType extends TerminalType{
  getTypeName(): string {
    return "boolean";
  }
}

export class UndefinedType extends TerminalType{
  getTypeName(): string {
    return "undefined";
  }
}

export abstract class ComplexType<P> extends Type<P>{

}

export class TupleType<T extends Type> extends ComplexType<T[]>{

  getTypeName(): string {
    return "tuple";
  }

  canWriteTo(target: Type) : boolean {
    if(this.equalsTo(target))
      return true
    if(target.canWriteBy?.(this))
      return true
    if(!['tuple','array'].includes(target.getTypeName()))
      return false
    if(target.getTypeName() == 'array'){
      const target_prototype = (target as ArrayType<Type>).getPrototype()
      for(let i=0;i<this.prototype.length;i++){
        if(!this.prototype[i].canWriteTo(target_prototype))
          return false
      }
      return true
    }
    const target_prototype = (target as TupleType<Type>).getPrototype()
    if(target_prototype.length!=this.prototype.length)
      return false
    for(let i=0;i<this.prototype.length;i++){
      if(!this.prototype[i].canWriteTo(target_prototype[i]))
        return false
    }
    return true
  }

  equalsTo(target: Type) {
    if(target.getTypeName()!=this.getTypeName())
      return false
    const target_prototype = (target as TupleType<Type>).getPrototype()
    if(target_prototype.length!=this.prototype.length)
      return false
    for(let i=0;i<this.prototype.length;i++){
      if(!target_prototype[i].equalsTo(this.prototype[i]))
        return false
    }
    return true
  }

}

export class ArrayType<T extends Type> extends ComplexType<T>{
  getTypeName(): string {
    return "array";
  }

  canWriteTo(target: Type) {
    return this.equalsTo(target) || target.canWriteBy?.(this)
  }

  equalsTo(target: Type): boolean {
    return target.getTypeName() == this.getTypeName() && this.getPrototype().equalsTo(target.getPrototype())
  }
}

export class ObjectType<P extends Record<string, Type>> extends ComplexType<P>{
  getTypeName(): string {
    return "object";
  }

  canWriteTo(target: Type) {
    if(this.equalsTo(target) || target.canWriteBy?.(this))
      return true
    if(target.getTypeName() != 'object')
      return false
    const target_prototype = (target as ObjectType<Record<string, Type>>).getPrototype()
    for(const key in this.prototype){
      if(!target_prototype[key] || !target_prototype[key].canWriteTo(this.prototype[key]))
        return false
    }
    return true
  }

  canWriteBy(target: Type) : boolean {
    return this.equalsTo(target) || target.canWriteTo(this)
  }

  equalsTo(target: Type): boolean {
    if(target.getTypeName()!=this.getTypeName())
      return false
    const target_prototype = (target as ObjectType<Record<string, Type>>).getPrototype()
    if(Object.keys(target_prototype).length!=Object.keys(this.prototype).length)
      return false
    for(const key in this.prototype){
      if(!target_prototype[key] || !target_prototype[key].equalsTo(this.prototype[key]))
        return false
    }
    return true
  }
}

export class UnionType<T extends Type[]> extends ComplexType<T>{
  getTypeName(): string {
    return "union";
  }

  canWriteTo(target: Type) {
    for(const type of this.prototype){
      if(!type.canWriteTo(target)){
        return false
      }
    }
    return true
  }

  equalsTo(target: Type) {
    if(target.getTypeName()!=this.getTypeName())
      return false
    const target_prototype = (target as UnionType<Type[]>).getPrototype()
    if(target_prototype.length!=this.prototype.length)
      return false
    for(const type of this.prototype){
      let found = target_prototype.findIndex(t=>t.equalsTo(type))
      if(found==-1)
        return false
      target_prototype.splice(found,1)
    }
    return true
  }

  canWriteBy(target:Type){
    return this.prototype.some((type)=>{
      return target.canWriteTo(type)
    })
  }
}

export class ClassType extends Type<string>{
  getTypeName(): string {
    return "class";
  }

  canWriteTo(target: Type) {
    return this.equalsTo(target) || target.canWriteBy?.(this)
  }

  equalsTo(target: Type) {
    return target.getTypeName() == this.getTypeName() && this.prototype == target.getPrototype()
  }
}

export class AnyType extends Type<never>{
  getTypeName(): string {
    return "any";
  }
  canWriteTo(target: Type): boolean {
    return true
  }
  canWriteBy(target: Type): boolean {
    return true
  }
  equalsTo(target: Type): boolean {
    return target.getTypeName() == this.getTypeName()
  }
}

export class NeverType extends Type<never>{
  getTypeName(): string {
    return "never";
  }
  canWriteTo(target: Type): boolean {
    return this.equalsTo(target)
  }
  canWriteBy(target: Type): boolean {
    return this.equalsTo(target)
  }
  equalsTo(target: Type): boolean {
    return target.getTypeName() == this.getTypeName()
  }
}

export function unify<T extends Type[]>(types:T):T[0]|UnionType<any>{
  if(!Array.isArray(types) || types.length <=1)
    return types[0]
  return new UnionType(types as Type[])
}

declare module "blockly"{
  interface Block{
    getOutputType():Type
  }
  interface Input{
    input_type:Type
  }
}

export class TypedConnectionChecker extends ConnectionChecker{
  protected workspace : WorkspaceSvg
  constructor(workspace:WorkspaceSvg) {
    super();
    this.workspace = workspace
  }
  doTypeChecks(a: Connection, b: Connection): boolean {
    if(!(a.type == 1 || b.type == 1))
      return super.doTypeChecks(a,b)
    const input = a.type == 1 ? a : b
    const output = a.type == 1 ? b : a
    const output_type = output.getSourceBlock().getOutputType?.()
    const input_type = input.getParentInput().input_type
    if(!output_type || !input_type)
      return super.doTypeChecks(a,b)
    return super.doTypeChecks(a,b) && output_type.canWriteTo(input_type)
  }
}

export function registerTypeExtension(workspace:WorkspaceSvg){
  workspace.addChangeListener(()=>{

  })
}
