import { JSX, Component, Accessor, Switch, Match, createSignal } from 'solid-js';

type Accessors<Type> = {
  [P in keyof Type]: Accessor<Type[P]>;
};

type Setters<Type> = {
  [P in keyof Type as `set${Capitalize<string & P>}`]: (v: Type[P]) => any;
};

type Signals<T> = Accessors<T> & Setters<T>;

type CCounterProps = Signals<UCounterProps>;

export const CCounter: Component<CCounterProps> = (p) => {
  const style: JSX.CSSProperties = {
    display: 'grid',
    gap: '5px',
    'grid-template-columns': 'repeat(2, max-content) 1fr',
    'align-items': 'center',
  };

  return (
    <>
      <div style={style}>
        <button type="button" onClick={() => p.setValue?.(p.value() - 1)}>
          &#9660;
        </button>
        <button type="button" onClick={() => p.setValue?.(p.value() + 1)}>
          &#9650;
        </button>
        <div>Counter: {p.value}</div>
      </div>
    </>
  );
};

interface UCounterProps {
  value: number;
}

export const UCounter: Component<UCounterProps> = (p) => {
  const [value, setValue] = createSignal(p.value);
  return <CCounter value={value} setValue={setValue} />;
};

export interface CounterPropsBase {
  controlled: boolean;
}

type CounterProps = CounterPropsBase & UCounterProps & Partial<Setters<UCounterProps>>;

export const Counter: Component<CounterProps> = (p) => {
  return (
    <Switch>
      <Match when={p.controlled}>
        <CCounter value={() => p.value} setValue={p.setValue} />
      </Match>
      <Match when={!p.controlled}>
        <UCounter value={p.value} />
      </Match>
    </Switch>
  );
};

export default Counter;
