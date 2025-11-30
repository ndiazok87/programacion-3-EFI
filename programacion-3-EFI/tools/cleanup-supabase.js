#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function removeKeys(obj, predicate) {
  if (!obj) return;
  for (const key of Object.keys(obj)) {
    if (predicate(key)) delete obj[key];
  }
}

function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const root = path.resolve(__dirname, '..');
  const pkgPath = path.join(root, 'package.json');
  const lockPath = path.join(root, 'package-lock.json');

  if (!fs.existsSync(pkgPath)) {
    console.error('package.json not found at', pkgPath);
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const matches = name => name && (name.startsWith('@supabase') || name === 'supabase' || name.startsWith('supabase'));

  ['dependencies','devDependencies','optionalDependencies','peerDependencies'].forEach(section => {
    if (pkg[section]) removeKeys(pkg[section], matches);
  });

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('Updated package.json (removed @supabase / supabase entries if present)');

  if (fs.existsSync(lockPath)) {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    if (lock.dependencies) removeKeys(lock.dependencies, matches);
    if (lock.packages) removeKeys(lock.packages, matches);
    // remove nested node_modules entries under lock by scanning keys
    for (const key of Object.keys(lock)) {
      if (matches(key)) delete lock[key];
    }
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2));
    console.log('Updated package-lock.json (removed top-level @supabase / supabase entries if present)');
  } else {
    console.log('No package-lock.json found — nothing to clean there');
  }

  console.log('\nNEXT STEPS:\n  1) Delete node_modules and run `npm install` to regenerate lockfile WITHOUT supabase packages.\n  2) If you use Git, review changes and commit.');
}

main();
