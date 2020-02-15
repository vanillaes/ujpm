import { promises as fs } from 'fs';
const PKG_PATH = process.cwd() + '/package.json';

export async function read () {
  try {
    await fs.stat(PKG_PATH);
  } catch {
    throw Error('ERR_CONFIG: package.json not found, is this a package?');
  }

  try {
    return JSON.parse(await fs.readFile(PKG_PATH, 'utf-8'));
  } catch {
    throw Error('ERR_CONFIG: Failed to read package.json');
  }
}

export async function write (pkg) {
  try {
    await fs.stat(PKG_PATH);
  } catch {
    throw Error('ERR_CONFIG: package.json not found, is this a package?');
  }

  try {
    await fs.writeFile(PKG_PATH, JSON.stringify(pkg, null, 2));
  } catch {
    throw Error('ERR_CONFIG: failed to write to package.json');
  }
}

export function exists (pkg) {
  if (pkg.modules) {
    throw Error('ERR_CONFIG: Init failed, \'pkg.modules\' already exists');
  }

  return pkg;
}

// has ujpm been initialized for this project?
export function isInitialized (pkg) {
  return !!(pkg.modules);
}

// fetch the names of installed packages
export function isInstalled (pkg, name) {
  const keys = Object.keys(pkg.modules);

  return keys.includes(name);
}

export default { read, write, exists, isInitialized, isInstalled };
