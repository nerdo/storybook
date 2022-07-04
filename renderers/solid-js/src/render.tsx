import { render as renderSolidJS } from 'solid-js/web';
import _h from 'solid-js/h';
import type { RenderContext } from '@storybook/store';
import { Args, ArgsStoryFn } from '@storybook/csf';
import { Accessor, Setter, batch, createSignal } from 'solid-js';
import type { SolidFramework } from './types';

type ValueOf<T> = T[keyof T];

type Accessors<Type> = {
  [P in keyof Type]: Accessor<Type[P]>;
};

// type Setters<Type> = {
//   [P in keyof Type as `set${Capitalize<string & P>}`]: Setter<Type[P]>;
// };

// type Signals<T> = Accessors<T> & Setters<T>;

interface SignalCache<T> {
  getters: Accessors<ValueOf<T>>;
  setters: { [key: string]: Setter<any> };
}

const componentSignalCache: Record<string, SignalCache<Args> | undefined> = {};

const ucFirst = (s: string) => `${(s[0] || '').toUpperCase()}${s.substring(1)}`;

const setterName = (s: string) => `set${ucFirst(s)}`;

const createArgSignalCache = (args: Args) =>
  Object.entries(args).reduce(
    (signals, [arg, value]) => {
      const [getter, setter] = createSignal(value);
      // eslint-disable-next-line no-param-reassign
      signals.getters[arg] = getter;
      // eslint-disable-next-line no-param-reassign
      signals.setters[setterName(arg)] = setter;
      return signals;
    },
    { getters: {}, setters: {} } as SignalCache<Args>
  );

const getSignalCache = (id: string, args: Args) => {
  const cacheExists = !!componentSignalCache[id];
  componentSignalCache[id] = componentSignalCache[id] || createArgSignalCache(args);
  const cached = componentSignalCache[id]!;

  if (cacheExists) {
    batch(() => {
      Object.keys(args).forEach((arg) => {
        const value = args[arg];
        const setter = cached.setters[setterName(arg)] as Setter<typeof value>;
        setter(value);
      });
    });
  }

  return cached;
};

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

  // When args change, reactivity is created at the top level by creating
  // a signal for each arg and sending the accessors to the story.
  // Arg changes are passed to signal setters to trigger reactivity.
  const cached = getSignalCache(context.id, args);

  return <Component {...cached.getters} />;
};

export function renderToDOM(
  { storyFn, storyContext, showMain, forceRemount }: RenderContext<SolidFramework>,
  domElement: Element
) {
  if (forceRemount) {
    domElement.replaceChildren();
  }

  showMain();

  if (forceRemount) {
    renderSolidJS(storyFn, domElement);
  } else {
    // When not re-mounting, the story is re-executed,
    // translating arg changes to signals.
    storyFn();
  }

  return () => {
    // When the story ends, remove its signal cache.
    componentSignalCache[storyContext.id] = undefined;
  };
}
