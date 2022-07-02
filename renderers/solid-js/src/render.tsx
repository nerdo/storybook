import { render } from 'solid-js/web';
import type { RenderContext } from '@storybook/store';
import type { SolidFramework } from './types';

export function renderToDOM(
  { storyFn, showMain, forceRemount }: RenderContext<SolidFramework>,
  domElement: Element
) {
  if (forceRemount) {
    render(() => null, domElement);
  }

  showMain();

  render(storyFn, domElement);
}
