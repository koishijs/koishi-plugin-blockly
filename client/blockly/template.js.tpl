export const name = "{{name}}"
export const using = {{using}}
export async function apply(ctx){
  const __logger = ctx.logger("{{name}}");
{{apply}}
}
