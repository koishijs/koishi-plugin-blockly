export class ReactiveValue<T extends any = any>{
  constructor(public value:T,public identifier:string){
  }

  watcher:Set<(value:T)=>void> = new Set;

  set(value:T){
    this.value = value;
    this.watcher.forEach(watcher=>watcher(value));
  }

  addWatcher(watcher:(value:T)=>void){
    this.watcher.add(watcher);
    return watcher
  }

  removeWatcher(watcher:(value:T)=>void){
    this.watcher.delete(watcher);
  }
}

export class ReactiveBindingSet<T extends any> extends Set<T>{

  watcher:Set<(bindingSet:ReactiveBindingSet<T>,value:T,type:'add'|'remove')=>void> = new Set

  constructor(){
    super();
  }

  add(value:T){
    this.watcher.forEach(watcher=>watcher(this,value,'add'));
    return super.add(value);
  }

  delete(value:T){
    this.watcher.forEach(watcher=>watcher(this,value,'remove'));
    return super.delete(value);
  }


  addWatcher(watcher:(bindingSet:ReactiveBindingSet<T>,value:T,type:'add'|'remove')=>void){
    this.watcher.add(watcher);
  }

  removeWatcher(watcher:(bindingSet:ReactiveBindingSet<T>,value:T,type:'add'|'remove')=>void){
    this.watcher.delete(watcher);
  }
}
