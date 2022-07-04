import { render as renderSolidJS } from 'solid-js/web';
import { createStore, Store } from 'solid-js/store';
import _h from 'solid-js/h';
import type { RenderContext } from '@storybook/store';
import { Args, ArgsStoryFn } from '@storybook/csf';
import { Accessor, Setter, batch, createSignal } from 'solid-js';
import type { SolidFramework } from './types';

type ValueOf<T> = T[keyof T];

type Accessors<Type> = {
  [P in keyof Type]: Accessor<Type[P]>;
};

type Setters<Type> = {
  [P in keyof Type as `set${Capitalize<string & P>}`]: Setter<Type[P]>;
};

type Signals<T> = Accessors<T> & Setters<T>;

interface SignalCache<T> {
  getters: Accessors<ValueOf<T>>;
  setters: { [key: string]: Setter<any> };
}

const createArgStore = (args: Args) => createStore(args);
const componentStores: Store<Record<string, ReturnType<typeof createArgStore> | undefined>> = {};

const componentSignalCache: Record<string, SignalCache<Args>> = {};

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

const getStore = (id: string, args: Args) => {
  const storeExists = !!componentStores[id];
  componentStores[id] = componentStores[id] || createArgStore(args);
  const [store, setStore] = componentStores[id]!;

  console.log('storeExists', storeExists, store);
  // if (storeExists) {
  batch(() => {
    // Object.keys(args).forEach((arg) => setStore(arg, args[arg]))
    Object.keys(args).forEach((arg) => {
      console.log(`${arg} = ${args[arg]}`);
      setStore(arg, args[arg]);
    });
  });
  // }

  return store;
};

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

  // const store = getStore(context.id, args)
  const cached = getSignalCache(context.id, args);

  console.log('DEBUG render');
  // return <Component {...store} />;
  return <Component {...cached.getters} />;
};

export function renderToDOM(
  { storyFn, storyContext, showMain, forceRemount }: RenderContext<SolidFramework>,
  domElement: Element
) {
  console.log('DEBUG renderToDOM', { forceRemount, storyContext });
  if (forceRemount) {
    domElement.replaceChildren();
  }

  showMain();

  if (forceRemount) {
    renderSolidJS(storyFn, domElement);
  } else {
    storyFn();
  }

  return () => {
    componentStores[storyContext.id] = undefined;
  };
}
