/**
 * Transform Tailwind config data into readable theme.json data.
 *
 * @param {string} type         The data type to return.
 * @param {any}    data         Tailwind data.
 * @param {Array}  customValues Array of custom values to return.
 * @return {Array|Object}       The data as an array or object.
 */
function transform(type, data, customValues = []) {
   switch (type) {
      case 'palette':
      case 'spacingSizes':
      case 'fontSizes':
         return data
            ? formatArray(flattenObject(data), customValues, type)
            : false;

      case 'fontSizes':
         return data
            ? formatArray(flattenObject(data), customValues, type)
            : false;

      default:
         return data ? formatValues(flattenObject(data), customValues) : false;
   }
}

export {transform};

/**
 * Format tailwind data for theme.json.
 * e.g.
 *  colors: {
 *   "red": "#ff0000",
 *   "black": "#000000",
 * }
 *
 * @param {object} data         The data as an object from tailwind.
 * @param {Array}  customValues Array of custom values to return.
 * @return {object}             The data as an object.
 */
function formatValues(data, customValues = []) {
   const values = {};
   for (const [key, value] of Object.entries(data)) {
      if (customValues.length) {
         // Custom values and key found.
         if (customValues.includes(key)) {
            values[key] = value.toString();
         }
      } else {
         values[key] = value.toString();
      }
   }
   return values;
}

/**
 * Format tailwnd data to be displayed as an array of options in theme.json.
 * Supported: Pallette, fontSizes, spacingSizes.
 *
 * e.g.
 * {
 *   "name": "black",
 *   "slug": "black",
 *   "color": "#000000"
 * }
 *
 * @param {object} data         The data as an object from tailwind.
 * @param {Array}  customValues Array of custom values to return.
 * @param {string} type         The data type to return.
 * @return {Array}              The data as an array of objects.
 */
function formatArray(data, customValues = [], type = 'pallette') {
   const values = [];

   // Convert the type to the correct option.
   let option = 'color';
   if (type === 'fontSizes' || type === 'spacingSizes') {
      option = 'size';
   }

   for (const [key, value] of Object.entries(data)) {
      values.push({
         name: titleCase(key),
         slug: key,
         [option]: value,
      });
   }

   if (!customValues.length) {
      return values; // Return all values.
   }

   // Filter values to only return instructed values.
   return values.filter((key) => {
      return customValues.includes(key.slug);
   });
}

/**
 * Flatten JS object from tailwind.
 *
 * @param {object} obj    The object to flatten.
 * @param {object} parent The parent object.
 * @param {object} res    The result of the flattened object.
 * @return {object}       The flattened object.
 */
function flattenObject(obj, parent, res = {}) {
   for (let key in obj) {
      let propName = parent ? parent + '-' + key : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
         // Only flatten if object is not an array.
         flattenObject(obj[key], propName, res);
      } else {
         res[propName] = obj[key];
      }
   }
   return res;
}

/**
 * Convert to titlecase.
 *
 * @param {string} str The string to convert.
 * @return {string}    The converted string.
 */
function titleCase(str) {
   if (!str) {
      return '';
   }

   // Don't format these words.
   const exceptions = ['of', 'the', 'and'];

   // Replace dashes and underscores with spaces.
   str = str.replace(/-/g, ' ').replace(/_/g, ' ');

   return str
      .toLowerCase()
      .split(' ')
      .map((word, i) => {
         return exceptions.includes(word) && i != 0
            ? word
            : word.charAt(0).toUpperCase().concat(word.substr(1));
      })
      .join(' ');
}
