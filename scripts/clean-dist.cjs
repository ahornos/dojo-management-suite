/**
 * @file clean-dist.cjs
 * @description Removes a package `dist/` directory after relaxing file modes so
 * Docker-root leftovers do not block a host rebuild.
 */

const fs = require('fs');
const path = require('path');

const target = path.resolve(process.cwd(), process.argv[2] || 'dist');

/**
 * Sets writable modes on every entry under `dir`.
 *
 * @param {string} dir - Directory to unlock.
 * @returns {void}
 */
function unlockTree(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    try {
      fs.chmodSync(full, entry.isDirectory() ? 0o777 : 0o666);
    } catch {
      /* Ownership may block chmod; `rmSync` reports the real EACCES. */
    }
    if (entry.isDirectory()) {
      unlockTree(full);
    }
  }

  try {
    fs.chmodSync(dir, 0o777);
  } catch {
    /* ignore */
  }
}

/**
 * Deletes `target` recursively.
 *
 * @returns {void}
 */
function clean() {
  if (!fs.existsSync(target)) {
    return;
  }

  unlockTree(target);

  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch (error) {
    if (error && error.code === 'EACCES') {
      console.error(
        `[clean-dist] EACCES removing ${target}. ` +
          'The folder is likely owned by root from a Docker bind-mount. ' +
          `Fix with: sudo rm -rf ${JSON.stringify(target)}`,
      );
    }
    throw error;
  }
}

clean();
