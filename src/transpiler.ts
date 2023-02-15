// Code from node_module rewrite-exports
const RE_COMMENTS = /\/\*[^]*?\*\//g;
const RE_KEYWORD = /(\bdefault\s+)?\b(let|const|class|function(?:\s*\*)?)(\s+)(\*?\s*[$\w][$\w\s\d,.=]+)([^]*?)$/i;
const RE_EXPORT = /(^|\s+)export(?!\w)\s*(\{[^{}]*?\}.*?(?=;\n?|$)|[^]*?(?=[\n;]|$))/gi;
const RE_FROM = /\bfrom\s+(["'])([^"']*)\1/gi;
const RE_DF = /\bdefault(\s+as\s+(\w+))?\b/i;
const RE_AS = /\b(\w+)\s+as\s+(\w+)\b/gi;

function allVars(chunks) {
  if (typeof chunks === 'string') return allVars(chunks.replace(/{|}/g, '').split(/\s*,\s*/).map(x => x.trim()));
  return chunks.reduce((memo, text) => memo.concat(text.split(/\s*,\s*/).map(x => x.trim())), []);
}

function mapVars(tokens) {
  return tokens.replace(/[{\s}]+/g, '').split(',').reduce((memo, k) => Object.assign(memo, { [k.split(':')[0]]: k.split(':')[1] }), {});
}

function rewriteExportBuilder(ctx, fn?, x?, f?) {
  ctx = ctx || 'module.exports';
  fn = fn || 'require';
  x = x || 'Object.assign';

  return (_, left, tokens) => {
    let prefix = `${left}${ctx}`;

    tokens = tokens.replace(RE_COMMENTS, _ => _.replace(/\S/g, ' '));
    const symbols = tokens.match(RE_KEYWORD);

    if (symbols) {
      if (symbols[2] === 'let' || symbols[2] === 'const') {
        let vars = symbols[4].split('=').filter(Boolean);
        let last = '';

        if (vars.length !== 1) {
          last = vars[vars.length - 1];
          vars = vars.slice(0, vars.length - 1);
        }

        if (!symbols[4].includes('=') && symbols[4].includes(',')) {
          return `${left}${tokens};${symbols[2] === 'let' && f ? f('let', allVars(vars), null, ctx, fn, x) : `${x}(${ctx},{${vars.join(',')}})`}`;
        }

        if (vars[0].includes(',')) {
          vars = vars[0].split(',');
        }
        return `${left}${symbols[2]}${symbols[3]}${vars.map(x => `${x}=${ctx}.${x.trim()}`).join('=void 0,')}=${last}${symbols[5]}`;
      }

      if (symbols[2] === 'class' || symbols[2].includes('function')) {
        prefix = prefix.replace(left, `${left}const ${symbols[4].split(/[({\s]+/)[0].replace('*', '')}=`);
      }

      if (!symbols[1]) {
        prefix += `.${symbols[4].trim().replace('*', '')}`;
      }
    }

    const def = tokens.match(RE_DF);

    if (tokens.match(RE_FROM)) {
      const vars = tokens.replace(RE_AS, '$2').replace(RE_FROM, '').replace(/\s+/g, '');
      let mod;

      tokens = tokens.replace(RE_FROM, (_, q, src) => `=${fn}("${mod = src}")`);
      tokens = tokens.replace(RE_AS, '$1:$2');

      const req = tokens.split('=').pop().trim();

      if (vars === '*') {
        return `${prefix}=${f ? f('*', req, mod, ctx, fn, x) : req}`;
      }

      if (def) {
        if (def[2]) {
          prefix += `.${def[2]}`;
        }

        return `${prefix}=${f ? f('default', req, mod, ctx, fn, x) : req}`;
      }

      return `${left}const ${tokens};${f ? f('const', allVars(vars), mod, ctx, fn, x) : `${x}(${ctx},${vars})`}`;
    }

    if (def) {
      if (symbols || !tokens.match(RE_AS)) {
        tokens = tokens.replace(RE_DF, '').trim();
      } else {
        tokens = tokens.match(RE_AS)[0].split(' ').shift();
      }
    } else {
      tokens = tokens.replace(RE_AS, '$2:$1');
    }

    if (!def && tokens.charAt() === '{') {
      if (tokens.includes('}')) {
        return `${left}${f ? f('object', mapVars(tokens), null, ctx, fn, x) : `${x}(${ctx},${tokens.replace(/\s+/g, '')})`}`;
      }
      return `${left}${ctx}=${tokens}`;
    }
    return `${prefix}=${tokens}`;
  };
}

const rewriteExport = (code, ctx?, fn?, x?, i?) => code.replace(RE_EXPORT, rewriteExportBuilder(ctx, fn, x, i));

//Code from rewrite-imports

function destruct(keys, target) {
  var out=[];
  while (keys.length) out.push(keys.shift().trim().replace(/ as /g, ':'));
  return 'const { ' + out.join(', ') + ' } = ' + target;
}

function generate(keys, dep, base) {
  if (keys.length && !base) return destruct(keys, dep);
  return 'const ' + base + ' = ' + dep + (keys.length ? ';\n' + destruct(keys, base) : '');
}

export function rewriteImport(str, fn?) {
  fn = fn || 'require';
  return str.replace(/(^|;\s*|\r?\n+)import\s*((?:\*\s*as)?\s*([a-z$_][\w$]*)?\s*,?\s*(?:{([\s\S]*?)})?)?\s*(from)?\s*(['"`][^'"`]+['"`])(?=;?)(?=([^"'`]*["'`][^"'`]*["'`])*[^"'`]*$)/gi, function (raw, ws, _, base, req, fro, dep) {
    dep = fn + '(' + dep + ')';
    return (ws||'') + (fro ? generate(req ? req.split(',') : [], dep, base) : dep);
  });
}

export function esModuleToCommonJs(code){
  return rewriteImport(rewriteExport(code));
}
