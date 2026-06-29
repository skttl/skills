#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const options = parseArgs(process.argv.slice(2));
const root = path.resolve(options.root ?? process.cwd());
const jsonPath = options.json;
const markdownPath = options.markdown;
const format = options.format ?? (jsonPath || markdownPath ? 'files' : 'json');

const result = {
  root,
  generatedAt: new Date().toISOString(),
  files: [],
  totals: {
    files: 0,
    contentTypes: 0,
    properties: 0,
  },
};

for (const file of walk(root)) {
  if (!isKnownSchemaFile(file)) continue;
  const extracted = extractFile(file);
  if (!extracted || extracted.contentTypes.length === 0) continue;
  result.files.push(extracted);
}

result.totals.files = result.files.length;
for (const file of result.files) {
  result.totals.contentTypes += file.contentTypes.length;
  for (const contentType of file.contentTypes) {
    result.totals.properties += contentType.properties.length;
  }
}

const json = `${JSON.stringify(result, null, 2)}\n`;
const markdown = renderMarkdown(result);

if (jsonPath) writeOutput(jsonPath, json);
if (markdownPath) writeOutput(markdownPath, markdown);

if (!jsonPath && !markdownPath) {
  if (format === 'markdown') {
    process.stdout.write(markdown);
  } else {
    process.stdout.write(json);
  }
}

function parseArgs(values) {
  const parsed = {
    root: null,
    json: null,
    markdown: null,
    format: null,
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === '--json') {
      parsed.json = values[index + 1] ?? null;
      index += 1;
    } else if (value === '--markdown') {
      parsed.markdown = values[index + 1] ?? null;
      index += 1;
    } else if (value === '--format') {
      parsed.format = values[index + 1] ?? null;
      index += 1;
    } else if (!value.startsWith('--') && !parsed.root) {
      parsed.root = value;
    }
  }

  return parsed;
}

function writeOutput(target, contents) {
  const resolved = path.resolve(target);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, contents, 'utf8');
}

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (['.git', 'node_modules', 'bin', 'obj'].includes(entry.name)) continue;

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
  return normalized.endsWith('.uda') || (/\/uSync\//i.test(normalized) && normalized.endsWith('.config'));
}

function extractFile(file) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }

  if (!looksLikeContentTypeSchema(text)) return null;

  const relativePath = path.relative(root, file).replaceAll(path.sep, '/');
  const contentTypeBlocks = findContentTypeBlocks(text);
  const blocks = contentTypeBlocks.length > 0 ? contentTypeBlocks : [{ tag: 'DocumentType', text }];
  const contentTypes = blocks
    .map((block) => extractContentType(block, file, relativePath))
    .filter((contentType) => contentType.alias || contentType.name || contentType.properties.length > 0);

  if (contentTypes.length === 0) return null;

  return {
    path: relativePath,
    absolutePath: file,
    format: file.endsWith('.uda') ? 'uda' : 'usync-config',
    contentTypes,
  };
}

function looksLikeContentTypeSchema(text) {
  return /<\s*(DocumentType|ContentType|MediaType|MemberType|ElementType)\b/i.test(text)
    || (/<\s*Info\b/i.test(text) && /<\s*(GenericProperties|PropertyTypes|Tabs|Groups)\b/i.test(text));
}

function findContentTypeBlocks(text) {
  const tags = ['DocumentType', 'ContentType', 'MediaType', 'MemberType', 'ElementType'];
  const blocks = [];
  for (const tag of tags) {
    const pattern = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'gi');
    for (const match of text.matchAll(pattern)) {
      blocks.push({ tag, text: match[0] });
    }
  }
  return blocks;
}

function extractContentType(block, absolutePath, relativePath) {
  const info = firstTag(block.text, 'Info') ?? block.text;
  const structure = firstTag(block.text, 'Structure') ?? block.text;

  return {
    kind: normalizeKind(block.tag, block.text),
    name: valueFromTags(info, ['Name']) ?? valueFromTags(block.text, ['Name']),
    alias: valueFromTags(info, ['Alias']) ?? attr(block.text, 'Alias') ?? valueFromTags(block.text, ['Alias']),
    description: valueFromTags(info, ['Description']) ?? valueFromTags(block.text, ['Description']),
    icon: valueFromTags(info, ['Icon']) ?? attr(block.text, 'Icon') ?? valueFromTags(block.text, ['Icon']),
    file: relativePath,
    absolutePath,
    tabs: extractTabs(structure),
    groups: extractGroups(structure),
    properties: extractProperties(block.text),
  };
}

function normalizeKind(tag, text) {
  const lower = tag.toLowerCase();
  if (lower !== 'contenttype') return kebab(lower.replace(/type$/, '-type'));

  const explicit = valueFromTags(text, ['ItemType', 'Type', 'ContentTypeComposition']);
  if (explicit) return kebab(explicit);
  if (/isElement\s*=\s*["']true["']/i.test(text) || /<\s*IsElement\s*>\s*true\s*<\//i.test(text)) return 'element-type';
  return 'content-type';
}

function extractTabs(text) {
  return extractNamedBlocks(text, ['Tab']).map((block) => ({
    name: valueFromTags(block, ['Name']) ?? attr(block, 'Name'),
    alias: valueFromTags(block, ['Alias']) ?? attr(block, 'Alias'),
    sortOrder: valueFromTags(block, ['SortOrder']) ?? attr(block, 'SortOrder'),
  })).filter(hasAnyValue);
}

function extractGroups(text) {
  return extractNamedBlocks(text, ['Group']).map((block) => ({
    name: valueFromTags(block, ['Name']) ?? attr(block, 'Name'),
    alias: valueFromTags(block, ['Alias']) ?? attr(block, 'Alias'),
    tab: valueFromTags(block, ['Tab']) ?? valueFromTags(block, ['TabAlias']) ?? attr(block, 'Tab'),
    sortOrder: valueFromTags(block, ['SortOrder']) ?? attr(block, 'SortOrder'),
  })).filter(hasAnyValue);
}

function extractProperties(text) {
  const blocks = [
    ...extractNamedBlocks(text, ['GenericProperty']),
    ...extractNamedBlocks(text, ['PropertyType']),
    ...extractNamedBlocks(text, ['Property']),
  ];

  const seen = new Set();
  const properties = [];

  for (const block of blocks) {
    const property = {
      label: valueFromTags(block, ['Name', 'Label']) ?? attr(block, 'Name') ?? attr(block, 'Label'),
      alias: valueFromTags(block, ['Alias']) ?? attr(block, 'Alias'),
      description: valueFromTags(block, ['Description']),
      tab: valueFromTags(block, ['Tab']) ?? valueFromTags(block, ['TabAlias']) ?? attr(block, 'Tab'),
      group: valueFromTags(block, ['Group']) ?? valueFromTags(block, ['GroupAlias']) ?? attr(block, 'Group'),
      editor: valueFromTags(block, ['Editor', 'PropertyEditorAlias', 'DataType', 'DataTypeKey']) ?? attr(block, 'Editor'),
      mandatory: valueFromTags(block, ['Mandatory']) ?? valueFromTags(block, ['IsMandatory']) ?? attr(block, 'Mandatory'),
      sortOrder: valueFromTags(block, ['SortOrder']) ?? attr(block, 'SortOrder'),
    };

    const key = `${property.alias ?? ''}|${property.label ?? ''}|${property.group ?? ''}`;
    if ((!property.alias && !property.label) || seen.has(key)) continue;
    seen.add(key);
    properties.push(property);
  }

  return properties;
}

function extractNamedBlocks(text, tagNames) {
  const blocks = [];
  for (const tagName of tagNames) {
    const pattern = new RegExp(`<${tagName}\\b[\\s\\S]*?<\\/${tagName}>`, 'gi');
    for (const match of text.matchAll(pattern)) blocks.push(match[0]);
  }
  return blocks;
}

function firstTag(text, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = text.match(pattern);
  return match ? match[1] : null;
}

function valueFromTags(text, tagNames) {
  for (const tagName of tagNames) {
    const value = firstTag(text, tagName);
    if (value !== null) return clean(value);
  }
  return null;
}

function attr(text, name) {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i');
  const match = text.match(pattern);
  return match ? clean(match[1]) : null;
}

function clean(value) {
  const withoutCdata = value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
  const trimmed = withoutCdata.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return decodeEntities(trimmed);
}

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function hasAnyValue(value) {
  return Object.values(value).some((item) => item !== null && item !== undefined && item !== '');
}

function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function renderMarkdown(data) {
  const lines = [
    '# Umbraco Friendly Schema Extraction',
    '',
    `Root: \`${data.root}\``,
    `Files: ${data.totals.files}`,
    `Content types: ${data.totals.contentTypes}`,
    `Properties: ${data.totals.properties}`,
    '',
  ];

  if (data.files.length === 0) {
    lines.push('No content type-like `.uda` or uSync `.config` schema files were found.', '');
    return lines.join('\n');
  }

  for (const file of data.files) {
    lines.push(`## ${file.path}`, '');
    for (const contentType of file.contentTypes) {
      lines.push(`### ${contentType.name ?? '(unnamed)'}${contentType.alias ? ` (${contentType.alias})` : ''}`, '');
      lines.push(`- Kind: ${contentType.kind ?? 'unknown'}`);
      if (contentType.description) lines.push(`- Description: ${contentType.description}`);
      if (contentType.icon) lines.push(`- Icon: ${contentType.icon}`);
      if (contentType.tabs.length > 0) lines.push(`- Tabs: ${contentType.tabs.map((tab) => tab.name ?? tab.alias).filter(Boolean).join(', ')}`);
      if (contentType.groups.length > 0) lines.push(`- Groups: ${contentType.groups.map((group) => group.name ?? group.alias).filter(Boolean).join(', ')}`);
      lines.push('');

      if (contentType.properties.length === 0) {
        lines.push('No properties extracted.', '');
        continue;
      }

      lines.push('| Label | Alias | Description | Group | Editor | Mandatory |');
      lines.push('| --- | --- | --- | --- | --- | --- |');
      for (const property of contentType.properties) {
        lines.push(`| ${cell(property.label)} | ${cell(property.alias)} | ${cell(property.description)} | ${cell(property.group ?? property.tab)} | ${cell(property.editor)} | ${cell(property.mandatory)} |`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function cell(value) {
  if (value === null || value === undefined || value === '') return '';
  return String(value).replaceAll('|', '\\|').replace(/\s+/g, ' ');
}
