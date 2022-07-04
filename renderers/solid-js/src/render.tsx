import type { RenderContext } from '@storybook/store';
import { Accessor, ErrorBoundary, Setter, Show, batch, createSignal } from 'solid-js';
import type { Args, ArgsStoryFn } from '@storybook/csf';
import { render as renderSolidJS } from 'solid-js/web';
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
  active: Accessor<boolean>;
  setActive: Setter<boolean>;
}

const componentSignalCache: Record<string, SignalCache<Args> | undefined> = {};

const ucFirst = (s: string) => `${(s[0] || '').toUpperCase()}${s.substring(1)}`;

const setterName = (s: string) => `set${ucFirst(s)}`;

const createArgSignalCache = (args: Args) => {
  const [active, setActive] = createSignal(true);

  // const getters = Object.create({})
  // Object.defineProperties()
  return Object.entries(args).reduce(
    (signals, [arg, value]) => {
      const [getter, setter] = createSignal(value);
      // eslint-disable-next-line no-param-reassign
      signals.getters[arg] = getter;
      // signals.getters[arg] = () => getter;
      // eslint-disable-next-line no-param-reassign
      signals.setters[setterName(arg)] = setter;
      return signals;
    },
    { getters: {}, setters: {}, active, setActive } as SignalCache<Args>
  );
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

  // Component rendering is wrapped in <Show></Show> to allow any onCleanup() effects
  // in it to run. This is necessary because there is really no other way to manually
  // dispose of a reactive scope in SolidJS... as far as I know :)
  // const [,getters] = splitProps(cached.getters, [])
  const { getters } = cached;
  console.log('getters', getters);
  return (
    <Show when={cached.active}>
      <ErrorBoundary
        fallback={(err, reset) => (
          <div>
            <div>Uncaught Error: {err || 'Something went wrong!'}</div>
            <div>
              <button type="button" onClick={() => reset()}>
                Reset
              </button>
            </div>
          </div>
        )}
      >
        <Component {...getters} />
      </ErrorBoundary>
    </Show>
  );
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
    const cached = componentSignalCache[storyContext.id];
    if (cached) {
      // This signals the wrapper to unmount the Story component
      cached.setActive(false);
    }
    componentSignalCache[storyContext.id] = undefined;
  };
}
