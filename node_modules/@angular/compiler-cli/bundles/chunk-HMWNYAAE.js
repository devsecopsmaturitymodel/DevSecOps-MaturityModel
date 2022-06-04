
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/src/locking/lock_file_with_child_process/util.mjs
function removeLockFile(fs, logger, lockFilePath, pid) {
  try {
    logger.debug(`Attempting to remove lock-file at ${lockFilePath}.`);
    const lockFilePid = fs.readFile(lockFilePath);
    if (lockFilePid === pid) {
      logger.debug(`PIDs match (${pid}), so removing ${lockFilePath}.`);
      fs.removeFile(lockFilePath);
    } else {
      logger.debug(`PIDs do not match (${pid} and ${lockFilePid}), so not removing ${lockFilePath}.`);
    }
  } catch (e) {
    if (e.code === "ENOENT") {
      logger.debug(`The lock-file at ${lockFilePath} was already removed.`);
    } else {
      throw e;
    }
  }
}

export {
  removeLockFile
};
//# sourceMappingURL=chunk-HMWNYAAE.js.map
