"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stylusLoader;

var _path = _interopRequireDefault(require("path"));

var _options = _interopRequireDefault(require("./options.json"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function stylusLoader(source) {
  const options = this.getOptions(_options.default);
  const callback = this.async();
  const implementation = (0, _utils.getStylusImplementation)(this, options.implementation);

  if (!implementation) {
    callback();
    return;
  }

  let data = source;

  if (typeof options.additionalData !== "undefined") {
    data = typeof options.additionalData === "function" ? await options.additionalData(data, this) : `${options.additionalData}\n${data}`;
  }

  const stylusOptions = (0, _utils.getStylusOptions)(this, options);
  const styl = implementation(data, stylusOptions); // include regular CSS on @import

  if (stylusOptions.includeCSS) {
    styl.set("include css", true);
  }

  if (stylusOptions.hoistAtrules) {
    styl.set("hoist atrules", true);
  }

  if (stylusOptions.lineNumbers) {
    styl.set("linenos", true);
  }

  if (stylusOptions.disableCache) {
    styl.set("cache", false);
  }

  const useSourceMap = typeof options.sourceMap === "boolean" ? options.sourceMap : this.sourceMap;

  if (stylusOptions.sourcemap || useSourceMap) {
    styl.set("sourcemap", useSourceMap ? {
      comment: false,
      sourceRoot: stylusOptions.dest,
      basePath: this.rootContext
    } : stylusOptions.sourcemap);
  }

  if (typeof stylusOptions.use !== "undefined" && stylusOptions.use.length > 0) {
    let {
      length
    } = stylusOptions.use; // eslint-disable-next-line no-plusplus

    while (length--) {
      let [item] = stylusOptions.use.splice(length, 1);

      if (typeof item === "string") {
        try {
          const resolved = require.resolve(item); // eslint-disable-next-line import/no-dynamic-require, global-require


          item = require(resolved)(stylusOptions);
        } catch (error) {
          callback(`Failed to load "${item}" Stylus plugin. Are you sure it's installed?\n${error}`);
          return;
        }
      }

      styl.use(item);
    }
  }

  if (typeof stylusOptions.import !== "undefined") {
    for (const imported of stylusOptions.import) {
      styl.import(imported);
    }
  }

  if (typeof stylusOptions.include !== "undefined") {
    for (const included of stylusOptions.include) {
      styl.include(included);
    }
  }

  if (stylusOptions.resolveURL !== false) {
    styl.define("url", (0, _utils.urlResolver)(stylusOptions.resolveURL));
  }

  const shouldUseWebpackImporter = typeof options.webpackImporter === "boolean" ? options.webpackImporter : true;

  if (shouldUseWebpackImporter) {
    styl.set("Evaluator", await (0, _utils.createEvaluator)(this, source, stylusOptions));
  }

  if (typeof stylusOptions.define !== "undefined") {
    const definitions = Array.isArray(stylusOptions.define) ? stylusOptions.define : Object.entries(stylusOptions.define);

    for (const defined of definitions) {
      styl.define(...defined);
    }
  }

  styl.render(async (error, css) => {
    if (error) {
      if (error.filename) {
        this.addDependency(_path.default.normalize(error.filename));
      }

      callback(error);
      return;
    } // eslint-disable-next-line no-underscore-dangle


    if (stylusOptions._imports.length > 0) {
      // eslint-disable-next-line no-underscore-dangle
      for (const importData of stylusOptions._imports) {
        if (_path.default.isAbsolute(importData.path)) {
          this.addDependency(_path.default.normalize(importData.path));
        } else {
          this.addDependency(_path.default.resolve(process.cwd(), importData.path));
        }
      }
    }

    let map = styl.sourcemap;

    if (map && useSourceMap) {
      map = (0, _utils.normalizeSourceMap)(map, stylusOptions.dest);

      try {
        map.sourcesContent = await Promise.all(map.sources.map(async file => (await (0, _utils.readFile)(this.fs, file)).toString()));
      } catch (fsError) {
        callback(fsError);
        return;
      }
    }

    callback(null, css, map);
  });
}