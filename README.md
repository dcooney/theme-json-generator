# Theme JSON Generator

Generate WordPress theme.json from your tailwind.config with Webpack.

## Config Parameters

| Option  | Description                                                                                          | Default            | Type      |
|------- |----------------------------------------------------------------------------------------------------- |------------------- |---------- |
| `in`   | Relative path to the config JS file used to generate `theme.json`.                                   | `theme.config.js`  | `string`  |
| `out`  | Relative path to the generated JSON file. If the file does not exist it will be created at runtime.  | `theme.json`       | `string`  |

**Note**: Do not use absolute filepaths using NodeJS `path` module in the`to` or `from` options. These should be relative file paths based on the location of the originating script.

```javascript
module.exports = {
 plugins: [
  new ThemeJsonPlugin( {
   from: './src/theme.config.js',
   to: './theme.json',
  } ),
 ],
};
```
