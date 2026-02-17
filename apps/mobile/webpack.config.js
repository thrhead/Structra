const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // React çakışmalarını önlemek için Alias (takma ad) ekliyoruz
  config.resolve.alias = {
    ...config.resolve.alias,
    'react': path.resolve(__dirname, '../../node_modules/react'),
    'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
  };

  return config;
};
