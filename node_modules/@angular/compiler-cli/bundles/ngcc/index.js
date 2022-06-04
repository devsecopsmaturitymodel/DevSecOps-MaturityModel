
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
import {
  mainNgcc
} from "../chunk-JW2HPJCH.js";
import "../chunk-HMWNYAAE.js";
import {
  clearTsConfigCache
} from "../chunk-6XCV2P22.js";
import "../chunk-4MML3U2F.js";
import "../chunk-3URTMUFW.js";
import "../chunk-4DFV4CTF.js";
import {
  ConsoleLogger,
  LogLevel
} from "../chunk-7J66ZDC5.js";
import "../chunk-5YNM7UVV.js";
import "../chunk-HJ5BXSPS.js";
import {
  NodeJSFileSystem,
  setFileSystem
} from "../chunk-MMRSE3VM.js";
import "../chunk-QK4SXRQA.js";
import "../chunk-GMSUYBZP.js";

// bazel-out/darwin_arm64-fastbuild/bin/packages/compiler-cli/ngcc/index.mjs
import { dirname, join } from "path";
import { fileURLToPath } from "url";
function process(options) {
  setFileSystem(new NodeJSFileSystem());
  return mainNgcc(options);
}
var containingDirPath = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(__ESM_IMPORT_META_URL__));
var ngccMainFilePath = join(containingDirPath, "./main-ngcc.js");
export {
  ConsoleLogger,
  LogLevel,
  clearTsConfigCache,
  containingDirPath,
  ngccMainFilePath,
  process
};
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=index.js.map
