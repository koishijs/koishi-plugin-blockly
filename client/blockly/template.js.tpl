(function(_module){
  Object.defineProperty(_module.exports,"__esModule",{value:true});
  Object.defineProperty(_module.exports,"__blocklyModule",{value:true});
  _module.exports.name = "{{name}}";
  _module.exports.using = {{using}};
  _module.exports.apply = function(ctx){
    const __logger = ctx.logger("{{name}}");
{{apply}}
  }
})(module);
