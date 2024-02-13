# Theme JSON for Developers

A Webpack plugin for programmatically generating WordPress [theme.json](https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/) with JavaScript from `tailwind.config` or another configuration file.

## Core Concepts

- Use Webpack and JavaScript functions to programmatically generate JSON files.
- Reduce duplicate code by re-using the Tailwind variables you're already to create the `theme.json` options.
- JSON is difficult to work with, writing JSON as JavaScript is much more efficient and allows for using variables and functions.

## Getting Started

To begin, you'll need to install `theme-json-generator`.

```console
npm install theme-json-generator --save-dev
```

Then add the plugin to your `webpack` config like so:

```js
// webpack.config.js
const { ThemeJsonPlugin } = require( 'theme-json-generator' );

module.exports = {
 plugins: [
  new ThemeJsonPlugin( {
   from: './src/theme.config.js',
   to: './theme.json',
  } ),
 ],
};
```

## Config Parameters

| Option  | Description                                                                                          | Default            | Type      |
|------- |----------------------------------------------------------------------------------------------------- |------------------- |---------- |
| `from` | Relative path to the config JS file used to generate `theme.json`.                                   | `theme.config.js`  | `string`  |
| `to`   | Relative path to the generated JSON file. If the file does not exist it will be created at runtime.  | `theme.json`       | `string`  |

**Note**: Do not use absolute filepaths using NodeJS `path` module in the`to` or `from` options. These should be relative file paths based on the location of the originating script.

## theme.config.js

`theme.config.js` is the JavaScript file used for compiling `theme.json`.

This file is essentially as JavaScript version of `theme.json` where functions and variables are used to build out the contents of the `json` file.

<details>
  <summary>Code Example</summary>

  In the code example below, Tailwind config values are passed into the `theme.config` and are used to generate the `theme.json` options.

  ```js
   // theme.config.js
   const {transform} = require('theme-json-generator'); // Plugin helper for transforming data.
   const {theme} = require('../tailwind.config.js'); // Import Tailwind config.

   module.exports = {
      settings: {
         layout: {
            contentSize: theme.extend.screens.desktop || '',
         },
         typography: {
            lineHeight: false,
            textDecoration: false,
            textTransform: false,
            dropCap: false,
            fontSizes: [],
            fontFamilies: [],
         },
         color: {
            palette: transform('palette', theme.extend.colors),
         },
         blocks: {
            'core/button': {
               color: {
                  background: true,
                  text: true,
                  gradients: [],
                  palette: transform('palette', theme.extend.colors),
               },
            },
            'core/pullquote': {
               border: {
                  radius: false,
                  style: false,
                  color: false,
                  width: false,
               },
               typography: {
                  fontSizes: [],
               },
            },
            'core/buttons': {
               layout: {},
               typography: {
                  fontSizes: [],
               },
            },
            'core/heading': {
               color: {
                  text: true,
                  background: true,
                  palette: transform('palette', theme.extend.colors, [
                     'blue',
                     'teal',
                     'cyan',
                     'black',
                  ]),
                  link: false,
               },
            },
         },
      },
      styles: {
         typography: {
            fontFamily: theme.extend.fontFamily.sans.toString(),
            fontSize: theme.extend.fontSize.base,
            lineHeight: '1.5',
         },
         elements: {
            link: {
               color: {
                  text: theme.extend.colors.blue,
               },
               typography: {
                  textDecoration: 'none',
               },
               ':hover': {
                  color: {
                     text: theme.extend.colors.black,
                  },
               },
               ':focus': {
                  color: {
                     text: theme.extend.colors.black,
                  },
               },
            },
            cite: {
               typography: {
                  fontSize: theme.extend.fontSize['14'],
                  fontStyle: 'normal',
                  fontWeight: '800',
                  textTransform: 'uppercase',
               },
            },
         },
         blocks: {
            'core/quote': {
               typography: {
                  fontSize: theme.extend.fontSize['20'],
                  fontWeight: '400',
               },
               color: {
                  text: theme.extend.colors.text,
                  background: theme.extend.colors.bkg,
               },
               spacing: {
                  padding: {
                     top: theme.spacing[5],
                     right: theme.spacing[5],
                     bottom: theme.spacing[5],
                     left: theme.spacing[5],
                  },
                  margin: {
                     bottom: theme.spacing[5],
                  },
               },
            },
            'core/heading': {
               typography: {
                  fontWeight: '700',
               },
               color: {
                  text: theme.extend.colors.heading,
               },
               spacing: {
                  margin: {
                     bottom: theme.spacing[3],
                  },
               },
            },
            'core/paragraph': {
               typography: {
                  lineHeight: '1.5',
               },
               color: {
                  text: theme.extend.colors.text,
               },
               spacing: {
                  margin: {
                     top: '0',
                     bottom: theme.spacing[5],
                  },
               },
            },
         },
      },
   };
   ```

</details>
