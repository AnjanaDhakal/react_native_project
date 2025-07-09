module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Removed deprecated expo-router/babel plugin - it's now included in babel-preset-expo
  };
};