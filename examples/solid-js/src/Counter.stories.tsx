import type { ComponentMeta, ComponentStory } from '@storybook/solid-js';
import Counter from './Counter';

export default {
  component: Counter,
} as ComponentMeta<typeof Counter>;

type Story = ComponentStory<typeof Counter>;

export const Standard: Story = {
  args: {
    value: 0,
  },
};
