import type { Accessor, Component } from 'solid-js';
import { createSignal, createEffect, onCleanup, Switch, Match } from 'solid-js';

export interface ErrorGeneratorProps {
  /**
   * The number of seconds before this component self-destructs (by throwing an error).
   */
  selfDestructSeconds?: number | Accessor<number>;

  /**
   * @default Default error message.
   */
  errorMessage?: string | Accessor<string>;
}

const getAccessor = (value: Accessor<any> | any) => {
  if (typeof value === 'function') return value;
  const [accessor] = createSignal(value);
  return accessor;
};

export const ErrorGenerator: Component<ErrorGeneratorProps> = (p) => {
  console.log('selfDestructSeconds', p.selfDestructSeconds);
  const selfDestructSeconds = getAccessor(p.selfDestructSeconds);
  const errorMessage = getAccessor(p.errorMessage);
  const [seconds, setSeconds] = createSignal(0);
  const [countdown, setCountdown] = createSignal(
    selfDestructSeconds ? selfDestructSeconds() : undefined
  );

  const intervalId = setInterval(() => setSeconds(seconds() + 1), 1000);

  onCleanup(() => {
    console.log(
      'onCleanup() called from ErrorGenerator component... calling clearInterval on our timer'
    );
    clearInterval(intervalId);
  });

  const generateAnError = () => {
    throw new Error(errorMessage() || 'Default error message.');
  };

  createEffect(() => {
    if (selfDestructSeconds && seconds() > selfDestructSeconds()) generateAnError();
  });

  createEffect(() => {
    setCountdown(selfDestructSeconds ? Math.max(0, selfDestructSeconds() - seconds()) : undefined);
  });

  return (
    <div>
      <Switch>
        <Match when={selfDestructSeconds === undefined}>
          <p>
            {seconds} second{seconds() === 1 ? '' : 's'} passed since this component was created.
          </p>
        </Match>
        <Match when={selfDestructSeconds !== undefined}>
          <p>
            This component will self-destruct in {countdown} second{countdown() === 1 ? '' : 's'}.
          </p>
        </Match>
      </Switch>
      <p>This component doesn't do much...</p>
      <p>It just increments a counter to let you know that it's alive... and when it might die!</p>
      <p>
        And provides a{' '}
        <button type="button" onClick={() => generateAnError()}>
          self destruct
        </button>{' '}
        button to trigger throwing an Error.
      </p>
    </div>
  );
};

export default ErrorGenerator;
