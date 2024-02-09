# Theme JSON for Developers

A Webpack plugin for generating WordPress theme.json with JavaScript from another source.

## Core Concept

Use Webpack and JavaScript functions to programtically generate a JSON file.

## Getting Started

To begin, you'll need to install `theme-json-generator`.

```console
npm install theme-json-generator --save-dev
```

Then add the plugin to your `webpack` config. For example:

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
