module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@app': './app',
          '@core': './app/core',
          '@components': './app/components',
          '@containers': './app/containers',
          '@screens': './app/screens',
          '@redux': './app/redux',
          '@utils': './app/utils',
          '@type': './app/types',
          '@constants': './app/constants',
          '@hooks': './app/hooks',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
};
