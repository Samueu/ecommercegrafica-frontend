import fs from 'fs';
import path from 'path';

const tag = 'div';
const wrongOpen = '<' + 'motion';
const rightOpen = '<' + tag;
const wrongClose = '</' + 'motion' + '>';
const rightClose = '</' + tag + '>';

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(name)) fix(p);
  }
}

function fix(file) {
  let c = fs.readFileSync(file, 'utf8');
  const n = c.split(wrongOpen).join(rightOpen).split(wrongClose).join(rightClose);
  if (n !== c) {
    fs.writeFileSync(file, n);
    console.log('fixed', file);
  }
}

walk('src');
