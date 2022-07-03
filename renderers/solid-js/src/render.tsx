import { render as renderSolidJS } from 'solid-js/web';
import _h from 'solid-js/h';
import type { RenderContext } from '@storybook/store';
import { ArgsStoryFn } from '@storybook/csf';
import type { SolidFramework } from './types';

// nerdo: for some reason, the tsconfig's jsxImportSource doesn't get respected
// and without importing and telling babel to use solid-js/h as the jsx function,
// it tries to use React.createElement which breaks all the things... 2022-07-03
/** @jsx _h */
export const render: ArgsStoryFn<SolidFramework> = (args, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};

export function renderToDOM(
  { storyFn, showMain, forceRemount }: RenderContext<SolidFramework>,
  domElement: Element
) {
  if (forceRemount) {
    // eslint-disable-next-line no-param-reassign
    domElement.innerHTML = '';
  }

  showMain();

  renderSolidJS(storyFn, domElement);
}
