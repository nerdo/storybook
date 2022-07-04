import type { ComponentMeta, ComponentStory } from '@storybook/solid-js';
import Counter from './Counter';

export default {
  component: Counter,
} as ComponentMeta<typeof Counter>;

type Story = ComponentStory<typeof Counter>;

export const UnControlled: Story = {
  args: {
    controlled: false,
    value: 0,
  },
};

export const Controlled: Story = {
  args: {
    controlled: true,
    value: 0,
  },
};
