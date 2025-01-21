// config-overrides.js
const { override, addBabelPlugins, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  // Add Babel plugins
  ...addBabelPlugins(
    '@babel/plugin-proposal-decorators', // Example Babel plugin for decorators
    '@babel/plugin-proposal-class-properties' // Example Babel plugin for class properties
  ),

  // Add Webpack aliases
  addWebpackAlias({
    ['@components']: path.resolve(__dirname, 'src/components'), // Example alias for components
    ['@utils']: path.resolve(__dirname, 'src/utils') // Example alias for utilities
  }),

  // Add custom Webpack configuration
  (config) => {
    // Example: Add a new loader
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    });

    // Return the modified config
    return config;
  }
);