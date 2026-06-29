#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? process.cwd());
const knownComponents = new Set([
  'umbValue',
  'umbLocalize',
  'umbContentName',
  'umbLink',
  'umbFormName',
  '=',
  '#',
]);
const knownFilters = new Set([
  'bytes',
  'fallback',
  'lowercase',
  'stripHtml',
  'titleCase',
  'truncate',
  'uppercase',
  'wordLimit',
]);
const deprecatedFilters = new Map([
  ['strip-html', 'stripHtml'],
  ['title-case', 'titleCase'],
  ['word-limit', 'wordLimit'],
]);
const likelyRichTextAliases = /\b(bodyText|richText|text|content|markup|rte)\b/i;
const likelySchemaKeys = /\b(label|labelTemplate|template|description|columns?|blocks?)\b/i;

const findings = [];

for (const file of walk(root)) {
  if (!isKnownSchemaFile(file)) continue;
  inspectFile(file);
}

if (findings.length === 0) {
  console.log('No UFM findings in .uda files or files under uSync directories.');
  process.exit(0);
}

for (const finding of findings) {
  const rel = path.relative(root, finding.file).replaceAll(path.sep, '/');
  console.log(`${finding.level.padEnd(5)} ${rel}:${finding.line}  ${finding.rule}`);
  console.log(`      ${finding.message}`);
  if (finding.sample) console.log(`      ${finding.sample}`);
}

process.exit(0);

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'bin' || entry.name === 'obj') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function isKnownSchemaFile(file) {
  const normalized = file.replaceAll(path.sep, '/');
  return normalized.endsWith('.uda') || /(^|\/)uSync\//i.test(normalized);
}

function inspectFile(file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return;
  }

  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!lineMayContainUfm(line)) return;
    inspectLine(file, index + 1, line);
  });
}

function lineMayContainUfm(line) {
  return /\$\{|[{][^{}\n]+[:=#][^{}\n]*[}]/.test(line) || (likelySchemaKeys.test(line) && /[{]|[|]/.test(line));
}

function inspectLine(file, lineNumber, line) {
  const sample = trimSample(line);

  if (/{{.*}}/.test(line)) {
    add('WARN', file, lineNumber, 'legacy-angularjs-template', 'Legacy AngularJS label template found. Rewrite it as Umbraco 17+ UFM.', sample);
  }

  inspectUnclosedComponents(file, lineNumber, line, sample);
  inspectExpressions(file, lineNumber, line, sample);
  inspectComponents(file, lineNumber, line, sample);
  inspectDeprecatedFilters(file, lineNumber, line, sample);
}

function inspectUnclosedComponents(file, lineNumber, line, sample) {
  const starts = [...line.matchAll(/(?<!\$)\{(?:[=#]|[a-zA-Z][\w-]*\s*:)/g)].map((match) => match.index ?? 0);
  for (const start of starts) {
    if (findClosingBrace(line, start) === -1) {
      add('ERROR', file, lineNumber, 'unclosed-component', 'UFM component starts with `{` but has no matching closing `}` on this line.', sample);
    }
  }
}

function inspectExpressions(file, lineNumber, line, sample) {
  const starts = [...line.matchAll(/\$\{/g)].map((match) => match.index ?? 0);
  for (const start of starts) {
    const end = findClosingBrace(line, start + 1);
    if (end === -1) {
      add('ERROR', file, lineNumber, 'unclosed-expression', 'UFM expression starts with `${` but has no matching closing `}` on this line.', sample);
      continue;
    }

    const expression = line.slice(start + 2, end);
    inspectFilters(file, lineNumber, expression, sample);
    if (likelyRichTextAliases.test(expression) && !/\bstripHtml\b/.test(expression)) {
      add('WARN', file, lineNumber, 'rich-text-without-strip-html', 'Rich text-looking expression should usually use `stripHtml` before rendering in a compact label.', sample);
    }
  }
}

function inspectComponents(file, lineNumber, line, sample) {
  if (/{{.*}}/.test(line)) return;

  const componentPattern = /(?<!\$)\{([^{}\n]+)\}/g;
  for (const match of line.matchAll(componentPattern)) {
    const body = match[1].trim();
    if (!body || body.startsWith('{')) continue;

    const marker = body[0] === '=' || body[0] === '#' ? body[0] : null;
    const colonIndex = body.indexOf(':');
    const component = marker ?? (colonIndex === -1 ? null : body.slice(0, colonIndex).trim());
    const content = marker ? body.slice(1).trim() : body.slice(colonIndex + 1).trim();

    if (!component) {
      add('ERROR', file, lineNumber, 'invalid-component-syntax', 'UFM component should use `{alias: contents}` or a supported short alias such as `{=headline}`.', sample);
      continue;
    }

    if (!knownComponents.has(component) && /^[a-zA-Z][\w-]*$/.test(component)) {
      add('WARN', file, lineNumber, 'unknown-component', `Component \`${component}\` is not a core Umbraco 17+ UFM component. Confirm it is registered as a custom ufmComponent.`, sample);
    }

    inspectFilters(file, lineNumber, content, sample);

    if ((component === 'umbValue' || component === '=') && likelyRichTextAliases.test(content) && !/\bstripHtml\b/.test(content)) {
      add('WARN', file, lineNumber, 'rich-text-without-strip-html', 'Rich text-looking value should usually use `stripHtml` before rendering in a compact label.', sample);
    }

    if ((component === 'umbValue' || component === '=') && !/\|\s*fallback\b/.test(content) && likelySchemaKeys.test(line)) {
      add('INFO', file, lineNumber, 'missing-fallback', 'Consider adding a `fallback` filter so empty values still produce useful editor labels.', sample);
    }
  }
}

function inspectDeprecatedFilters(file, lineNumber, line, sample) {
  for (const [deprecated, replacement] of deprecatedFilters) {
    if (new RegExp(`\\|\\s*${escapeRegExp(deprecated)}\\b`).test(line)) {
      add('WARN', file, lineNumber, 'deprecated-filter', `Use \`${replacement}\` instead of \`${deprecated}\` for Umbraco 17+ UFM.`, sample);
    }
  }
}

function inspectFilters(file, lineNumber, text, sample) {
  const parts = splitPipedFilters(text).slice(1);
  for (const part of parts) {
    const alias = part.trim().split(':')[0]?.trim();
    if (!alias) continue;
    if (deprecatedFilters.has(alias) || knownFilters.has(alias)) continue;
    if (/^[a-zA-Z][\w-]*$/.test(alias)) {
      add('WARN', file, lineNumber, 'unknown-filter', `Filter \`${alias}\` is not a core Umbraco 17+ UFM filter. Confirm it is registered as a custom ufmFilter.`, sample);
    }
  }
}

function splitPipedFilters(text) {
  const parts = [];
  let current = '';
  let quote = null;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const previous = text[i - 1];
    const next = text[i + 1];

    if (quote) {
      current += char;
      if (char === quote && previous !== '\\') quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === '|' && previous !== '|' && next !== '|') {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  parts.push(current);
  return parts;
}

function findClosingBrace(text, openBraceIndex) {
  let depth = 0;
  let quote = null;

  for (let i = openBraceIndex; i < text.length; i += 1) {
    const char = text[i];
    const previous = text[i - 1];

    if (quote) {
      if (char === quote && previous !== '\\') quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function add(level, file, line, rule, message, sample) {
  findings.push({ level, file, line, rule, message, sample });
}

function trimSample(line) {
  const trimmed = line.trim();
  return trimmed.length > 140 ? `${trimmed.slice(0, 137)}...` : trimmed;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
