import {Field, FieldDropdown, MenuGenerator, MenuGeneratorFunction, MenuOption} from "blockly";
import {ReactiveBindingSet, ReactiveValue} from "../binding";

export class FieldBindingStringDropdown extends FieldDropdown {

  protected override menuGenerator_: MenuGeneratorFunction | null;

  protected trace = Symbol('Dropdown Tracing')

  constructor(protected targets: ReactiveBindingSet<ReactiveValue<string>>) {
    super(Field.SKIP_SETUP)
    this.menuGenerator_ = FieldBindingStringDropdown.generateBindingMenu as MenuGeneratorFunction
    targets.forEach((target) => {
      this.traceReactive(target)
    })
    targets.addWatcher((bindingSet, value, type) => {
      if (type === 'add') {
        this.traceReactive(value)
      } else {
        this.detachReactive(value)
      }
    })
  }

  static generateBindingMenu(this: FieldBindingStringDropdown) {
    return Array.from(this.targets).map((target) => {
      return [target.value, target.identifier]
    })
  }

  traceReactive(value: ReactiveValue<string>) {
    if (value[this.trace]) return;
    value[this.trace] = value.addWatcher((s) => {
      if (this.value_ == value.identifier) {
        this.value_ = value.identifier
        this.doValueUpdate_(value.identifier)
        this.forceRerender()
      }
    })
  }

  detachReactive(value: ReactiveValue<string>) {
    if (!value[this.trace]) return;
    value.removeWatcher(value[this.trace]);
    if (this.value_ == value.identifier) {
      this.value_ = undefined
      this.forceRerender()
    }
    delete value[this.trace];
  }

  dispose() {
    this.targets.forEach((target) => {
      this.detachReactive(target)
    })
    super.dispose()
  }

  protected getDisplayText_(): string {
    return (this.menuGenerator_ as () => any)().find(t => t[1] == this.value_)?.[0] ?? ''
  }

  override doClassValidation_(opt_newValue) {
    return opt_newValue
  }

  getOptions(opt_useCache?: boolean): MenuOption[] {
    if(this.menuGenerator_().length==0)return []
    return super.getOptions(opt_useCache);
  }
}
