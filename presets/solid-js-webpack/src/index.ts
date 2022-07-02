import type { StorybookConfig } from './types';

export * from './types';

export const babelDefault: StorybookConfig['babelDefault'] = (config) => {
  return {
    ...config,
    plugins: [...(config.plugins || []), [require.resolve('babel-preset-solid')]],
  };
};
