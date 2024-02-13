const {transform} = require('theme-json-generator'); // Load plugin helper function for transforming data.
const {theme} = require('./tailwind.config.js'); // Import Tailwind config.

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
               gradients: [],
               palette: transform('palette', theme.extend.colors),
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
