import type { StorybookConfig } from './types';

export * from './types';

export const babelDefault: StorybookConfig['babelDefault'] = async (config) => {
  return {
    ...config,
    presets: [...(config?.presets || []), [require.resolve('babel-preset-solid')]],
    // ModuleParseError happens with or without this...
    // plugins: [
    //   ...(config?.plugins || []),
    //   [require.resolve('solid-refresh/babel'), { "bundler": "webpack5" }]
    //   // [require.resolve('solid-refresh/babel')]
    // ],
  };
};

// export const babel: StorybookConfig['babel'] = async (config) => {
//   console.log('BABEL', JSON.stringify(config, undefined, 2))
//   return config
// };
