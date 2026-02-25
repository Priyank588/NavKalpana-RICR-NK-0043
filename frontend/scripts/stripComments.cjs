const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const processExts = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.mjs', '.cjs', '.txt', '.md']);

function shouldProcess(filePath) {
  if (filePath.includes('node_modules') || filePath.includes('.git')) return false;
  const ext = path.extname(filePath).toLowerCase();
  return processExts.has(ext) || path.basename(filePath) === '.gitignore' || path.basename(filePath).endsWith('.env');
}

function stripJSLikeComments(input) {
  let out = '';
  const len = input.length;
  let i = 0;
  let state = 'normal';
  while (i < len) {
    const ch = input[i];
    const next = input[i+1];

    if (state === 'normal') {
      if (ch === '{' && next === '/' && input[i+2] === '*') {
        i += 3;
        while (i < len && !(input[i] === '*' && input[i+1] === '/' && input[i+2] === '}')) i++;
        i += 3;
        continue;
      }
      if (ch === '<' && next === '!' && input.substr(i,4) === '<!--') {
        i += 4;
        while (i < len && !(input[i] === '-' && input[i+1] === '-' && input[i+2] === '>')) i++;
        i += 3;
        continue;
      }
      if (ch === '/' && next === '/') {
        const prevChars = out.slice(-6);
        if (!/https?:\/\/$/.test(prevChars + ch + next)) {
          i += 2;
          while (i < len && input[i] !== '\n') i++;
          continue;
        }
      }
      if (ch === '/' && next === '*') {
        i += 2;
        let sawNewline = false;
        while (i < len && !(input[i] === '*' && input[i+1] === '/')) {
          if (input[i] === '\n') sawNewline = true;
          i++;
        }
        i += 2;
        if (sawNewline) out += '\n';
        continue;
      }
      if (ch === "'") { state = 'single'; out += ch; i++; continue; }
      if (ch === '"') { state = 'double'; out += ch; i++; continue; }
      if (ch === '`') { state = 'template'; out += ch; i++; continue; }
      out += ch; i++; continue;
    }
    if (state === 'single') {
      if (ch === '\\') { out += ch; out += input[i+1] || ''; i += 2; continue; }
      if (ch === "'") { state = 'normal'; out += ch; i++; continue; }
      out += ch; i++; continue;
    }
    if (state === 'double') {
      if (ch === '\\') { out += ch; out += input[i+1] || ''; i += 2; continue; }
      if (ch === '"') { state = 'normal'; out += ch; i++; continue; }
      out += ch; i++; continue;
    }
    if (state === 'template') {
      if (ch === '\\') { out += ch; out += input[i+1] || ''; i += 2; continue; }
      if (ch === '`') { state = 'normal'; out += ch; i++; continue; }
      out += ch; i++; continue;
    }
  }
  return out.replace(/\n{3,}/g, '\n\n');
}

function stripFileContent(content, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.css', '.html'].includes(ext) || filePath.includes('.env') || ext === '.md' || ext === '.txt') {
    let out = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
    out = stripJSLikeComments(out);
    out = out.replace(//g, '');
    return out;
  }
  if (ext === '.json') {
    let out = content.replace(/\/\*[\s\S]*?\*\
    out = out.replace(/^\s*\/\/.*$/gm, '');
    out = out.replace(/\n{3,}/g, '\n\n');
    return out;
  }
  if (path.basename(filePath) === '.gitignore' || filePath.endsWith('.env')) {
    return content.replace(/^\s*#.*$/gm, '').replace(/\n{3,}/g, '\n\n');
  }
  return content.replace(/\/\*[\s\S]*?\*\
}

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (it.name === 'node_modules' || it.name === '.git') continue;
      walk(full);
    } else if (it.isFile()) {
      if (!shouldProcess(full)) continue;
      try {
        const orig = fs.readFileSync(full, 'utf8');
        const stripped = stripFileContent(orig, full);
        if (stripped !== orig) {
          fs.writeFileSync(full, stripped, 'utf8');
          console.log('Stripped:', path.relative(ROOT, full));
        }
      } catch (err) {
        console.error('Error', full, err.message);
      }
    }
  }
}

console.log('Starting comment strip in', ROOT);
walk(ROOT);
console.log('Done.');
