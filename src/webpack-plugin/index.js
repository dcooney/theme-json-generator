const path = require('path');
const fs = require('fs');

const defaults = {
   path: path.resolve('./'),
   file: 'theme.config.js',
   target: 'theme.json',
   schema: 'https://schemas.wp.org/trunk/theme.json',
   version: 2,
};

/**
 * Webpack plugin class to create file from source.
 *
 * @see https://webpack.js.org/contribute/writing-a-plugin/
 */
class ThemeJsonPlugin {
   constructor(options = {}) {
      this.name = 'theme-json-webpack-plugin';
      this.options = {...defaults, ...options}; // Spread in defaults.
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

   console.log(params);

   // Exit if required param is missing or path is referencing an outside directory.
   const validPaths = validatePaths(params, webpackLogger);
   if (!validPaths) {
      return;
   }

   // Validate the file and target full paths.
   const paths = generatePaths(params);

   // Comfirm file exists.
   if (fileExists(paths?.file) && paths?.target) {
      const data = requireUncached(paths.file); // Load config file.
      const output = path.resolve(paths.target); // Path to output file.

      // Create theme.json object.
      const themeJSON = {
         $schema: params.schema,
         version: params.version,
         ...data,
      };

      // Write to file.
      fs.writeFile(output, JSON.stringify(themeJSON, null, 3), function (err) {
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
               path.basename(params.target) + ' created successfully!'
            );
         }
      });
   } else {
      if (webpackLogger) {
         webpackLogger.error(
            'Unable to locate source file. Use the `file` option to specify the path to the source file.'
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
 * Vaildate the file and target params do not contain `./`.
 *
 * @param {object} options Webpack config options.
 * @return {object}        Modified fiel and target params.
 */
function generatePaths(params) {
   let {file, target, path} = params;

   // Remove leading `.` from string.
   file = file.charAt(0) === '.' ? file.substring(1) : file;

   // File must start with `/`.
   file = file.charAt(0) !== '/' ? `/${file}` : file;

   // Remove leading `.` from string.
   target = target.charAt(0) === '.' ? target.substring(1) : target;

   //  Target must start with `/`.
   target = target.charAt(0) !== '/' ? `/${target}` : target;

   return {
      file: `${path}${file}`,
      target: `${path}${target}`,
   };
}

/**
 * Validate paths to file and target parameters do not try to back out of the current .
 *
 * @param {object} options       Webpack config options.
 * @param {object} webpackLogger Optional webpack logger.
 * @return {boolean}             True if paths are valid.
 */
function validatePaths(params, webpackLogger = false) {
   const {path, file, target} = params;

   // Exit if any required parameter is empty or missing.
   if (!params.path || !params.file || !params.target) {
      const missing =
         'Missing paremeters required to generate theme.json file.';
      if (webpackLogger) {
         webpackLogger.error(missing);
      } else {
         console.warn(missing);
      }
      return false;
   }

   // Exit if file path is outside current directory.
   if (path.includes('../') || file.includes('../') || target.includes('../')) {
      const msg =
         'The path, file and target options cannot reference a directory outside of the current working directory.';
      if (webpackLogger) {
         webpackLogger.error(msg);
      } else {
         console.warn(msg);
      }
      return false;
   }

   return true;
}
