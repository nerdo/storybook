import { JSX, Component, createSignal, onCleanup } from 'solid-js';

export interface CounterProps {
  reactive: boolean;
  value: number;
}

export const Counter: Component<CounterProps> = (p) => {
  const [value, setValue] = createSignal(p.value);
  const style: JSX.CSSProperties = {
    display: 'grid',
    gap: '5px',
    'grid-template-columns': 'repeat(2, max-content) 1fr',
    'align-items': 'center',
  };

  return (
    <>
      <div style={style}>
        <button type="button" onClick={() => setValue(value() - 1)}>
          &#9660;
        </button>
        <button type="button" onClick={() => setValue(value() + 1)}>
          &#9650;
        </button>
        <div>Counter: {value}</div>
      </div>
    </>
  );
};

export default Counter;
