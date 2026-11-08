import type { ProgrammingLanguageSlug } from '../../../core/models/user.model';

interface LanguageSpec {
  tokenRegex: RegExp;
  keywords: Set<string>;
}

const PY_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
  'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
  'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
  'try', 'while', 'with', 'yield', 'print', 'len', 'range', 'input', 'int', 'str', 'float',
  'list', 'dict', 'set', 'tuple', 'bool', 'type', 'open', 'enumerate', 'zip', 'map', 'filter',
  'sorted', 'sum', 'min', 'max', 'abs',
]);

const JS_KEYWORDS = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
  'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in',
  'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
  'let', 'void', 'while', 'with', 'yield', 'async', 'await', 'static', 'get', 'set', 'of',
  'null', 'undefined', 'true', 'false', 'interface', 'type', 'enum', 'implements', 'private',
  'public', 'protected', 'readonly', 'namespace', 'declare', 'as', 'constructor', 'console',
]);

const CPP_KEYWORDS = new Set([
  'alignas', 'alignof', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'class', 'const',
  'constexpr', 'continue', 'decltype', 'default', 'delete', 'do', 'double', 'dynamic_cast',
  'else', 'enum', 'explicit', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if',
  'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'nullptr', 'operator',
  'private', 'protected', 'public', 'register', 'return', 'short', 'signed', 'sizeof',
  'static', 'static_assert', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try',
  'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile',
  'while', 'std', 'cout', 'cin', 'endl', 'include', 'define',
]);

// Token classes, ordered so string/comment delimiters win over plainer tokens
// (e.g. a '#' inside a string shouldn't start a new comment match) when they
// start at the same position — regex alternation picks the first alternative
// that matches at a given index.
const PY_TRIPLE = /'''[\s\S]*?'''|"""[\s\S]*?"""/;
const LINE_COMMENT_HASH = /#[^\n]*/;
const LINE_COMMENT_SLASH = /\/\/[^\n]*/;
const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//;
const SINGLE_QUOTE_STR = /'(?:\\.|[^'\\\n])*'/;
const DOUBLE_QUOTE_STR = /"(?:\\.|[^"\\\n])*"/;
const TEMPLATE_STR = /`(?:\\.|[^`\\])*`/;
const NUMBER = /\b\d+\.?\d*\b/;
const WORD = /\b[A-Za-z_]\w*\b/;

function buildRegex(parts: RegExp[]): RegExp {
  return new RegExp(parts.map((p) => p.source).join('|'), 'g');
}

const SPECS: Record<ProgrammingLanguageSlug, LanguageSpec> = {
  python: {
    tokenRegex: buildRegex([PY_TRIPLE, LINE_COMMENT_HASH, SINGLE_QUOTE_STR, DOUBLE_QUOTE_STR, NUMBER, WORD]),
    keywords: PY_KEYWORDS,
  },
  javascript: {
    tokenRegex: buildRegex([
      BLOCK_COMMENT, LINE_COMMENT_SLASH, SINGLE_QUOTE_STR, DOUBLE_QUOTE_STR, TEMPLATE_STR, NUMBER, WORD,
    ]),
    keywords: JS_KEYWORDS,
  },
  typescript: {
    tokenRegex: buildRegex([
      BLOCK_COMMENT, LINE_COMMENT_SLASH, SINGLE_QUOTE_STR, DOUBLE_QUOTE_STR, TEMPLATE_STR, NUMBER, WORD,
    ]),
    keywords: JS_KEYWORDS,
  },
  cpp: {
    tokenRegex: buildRegex([BLOCK_COMMENT, LINE_COMMENT_SLASH, SINGLE_QUOTE_STR, DOUBLE_QUOTE_STR, NUMBER, WORD]),
    keywords: CPP_KEYWORDS,
  },
};

const COLORS = {
  comment: '#6b7280',
  string: '#9ece6a',
  number: '#f6a95a',
  keyword: '#c792ea',
  function: '#22d3ee',
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// A small regex/keyword-based highlighter — not a real parser, but enough to
// color keywords/strings/numbers/comments/function calls for the short
// snippets these exercises use, without a full tokenizer dependency.
export function highlightCode(code: string, language: ProgrammingLanguageSlug): string {
  const spec = SPECS[language];
  const regex = spec.tokenRegex;
  regex.lastIndex = 0;

  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(code))) {
    const token = match[0];
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index));
    }

    const firstChar = token[0];
    let color: string | null = null;

    if (firstChar === '#' || token.startsWith('//') || token.startsWith('/*')) {
      color = COLORS.comment;
    } else if (firstChar === "'" || firstChar === '"' || firstChar === '`') {
      color = COLORS.string;
    } else if (/^\d/.test(token)) {
      color = COLORS.number;
    } else if (/^[A-Za-z_]/.test(token)) {
      if (spec.keywords.has(token)) {
        color = COLORS.keyword;
      } else if (code[match.index + token.length] === '(') {
        color = COLORS.function;
      }
    }

    result += color ? `<span style="color:${color}">${escapeHtml(token)}</span>` : escapeHtml(token);
    lastIndex = match.index + token.length;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex));
  }

  return result;
}
