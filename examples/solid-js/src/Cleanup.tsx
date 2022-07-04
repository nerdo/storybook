import { Component, onCleanup } from 'solid-js';

export const Cleanup: Component = () => {
  onCleanup(() => console.log('onCleanup() called from Cleanup component'));

  return (
    <div>
      <p>
        Tihs component has an <code>onCleanup()</code> handler in it.
      </p>
      <p>
        It <code>console.log</code>s to let you know it was called.
      </p>
      <p>Check the console for activity when this component dies (i.e. switch to another Story).</p>
    </div>
  );
};

export default Cleanup;
