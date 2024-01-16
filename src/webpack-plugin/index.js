const path = require('path');
const fs = require('fs');

const defaults = {
   path: path.resolve('./'),
   from: 'theme.config.js',
   to: 'theme.json',
   schema: 'https://schemas.wp.org/trunk/theme.json',
   version: 2,
};

/**
 * Webpack plugin class to create file from source.
 *
 * @see https://webpack.js.org/contribute/writing-a-plugin/
 */
class ThemeJsonPlugin {
   constructor(data) {
      this.name = 'theme-json-plugin';
      this.options = {...defaults, ...data}; // Spread in defaults.
   }

   apply(compiler) {
      compiler.hooks.done.tap('ThemeJsonPlugin', () => {
         const logger = compiler.getInfrastructureLogger(this.name);
         generateThemeJson({...this.options}, logger);
      });
   }
}

/**
 * Generate Theme JSON from source file.
 *
 * @param {object} options       Webpack config options.
 * @param {object} webpackLogger Optional webpack logger.
 */
function generateThemeJson(options, webpackLogger = false) {
   const params = {...defaults, ...options}; // Spread in defaults with options.

   // Exit if required param is missing or path is referencing an outside directory.
   const validPaths = validatePaths(params, webpackLogger);
   if (!validPaths) {
      return;
   }

   // Validate the file paths.
   const paths = generatePaths(params);

   // Comfirm file exists.
   if (fileExists(paths?.from) && paths?.to) {
      const data = requireUncached(paths.from); // Load config file.
      const out = path.resolve(paths.to); // Path to output file.

      // Create theme.json object.
      const json = {
         $schema: params.schema,
         version: params.version,
         ...data,
      };

      // Write to file.
      fs.writeFile(out, JSON.stringify(json, null, 3), function (err) {
         if (err) {
            if (webpackLogger) {
               webpackLogger.error(err);
            } else {
               console.warn(err);
            }
            return;
         }
         if (webpackLogger) {
            webpackLogger.info(
               path.basename(params.to) + ' created successfully!'
            );
         }
      });
   } else {
      if (webpackLogger) {
         webpackLogger.error(
            'Unable to locate source file. Use the `from` option to specify the relative path to the config file and the `to` option to speicify the output file.'
         );
      }
   }
}

export {ThemeJsonPlugin, generateThemeJson};

/**
 * Check if a file exists.
 *
 * @param {string} filepath The file path to check.
 * @return {boolean}
 */
function fileExists(filepath) {
   return fs.existsSync(filepath);
}

/**
 * Uncache a NodeJS require module.
 *
 * @param {string} module The module path to uncache.
 */
function requireUncached(module) {
   delete require.cache[require.resolve(module)];
   return require(module);
}

/**
 * Vaildate the from and to params do not contain `./`.
 *
 * @param {object} options Webpack config options.
 * @return {object}        Modified file and out params.
 */
function generatePaths(params) {
   let {from, to, path} = params;

   // Validate the `from` path.
   from = from.replace(/\/\//g, '/'); // Remove `//`, from string.
   from = from.charAt(0) === '.' ? from.substring(1) : from; // Remove leading `.` from string.
   from = from.startsWith('/') ? from.substring(1) : from; // Remove leading `/` from string.

   // Validate the `to` path.
   to = to.replace(/\/\//g, '/'); // Remove // from string.
   to = to.charAt(0) === '.' ? to.substring(1) : to; // Remove leading `.` from string.
   to = to.startsWith('/') ? to.substring(1) : to; //

   return {
      from: `${path}/${from}`,
      to: `${path}/${to}`,
   };
}

/**
 * Validate paths to file and out parameters do not try to back out of the current .
 *
 * @param {object} options       Webpack config options.
 * @param {object} webpackLogger Optional webpack logger.
 * @return {boolean}             True if paths are valid.
 */
function validatePaths(params, webpackLogger = false) {
   const {path, from, to} = params;

   // Exit if any required parameter is empty or missing.
   if (!path || !from || !to) {
      const missing =
         'Missing parameters required to generate theme.json file.';
      if (webpackLogger) {
         webpackLogger.error(missing);
      } else {
         console.warn(missing);
      }
      return false;
   }

   // Exit if any path is outside current directory.
   if (from.includes('../') || to.includes('../')) {
      const msg =
         'The path, from and to options cannot reference a directory outside of the current base working directory.';
      if (webpackLogger) {
         webpackLogger.error(msg);
      } else {
         console.warn(msg);
      }
      return false;
   }

   return true;
}
