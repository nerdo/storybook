import type { ComponentMeta, ComponentStory } from '@storybook/solid-js';
import Counter from './Counter';

export default {
  component: Counter,
} as ComponentMeta<typeof Counter>;

type Story = ComponentStory<typeof Counter>;

export const Uncontrolled: Story = {
  args: {
    controlled: false,
    value: 0,
  },
};

export const ControlledCSFv3: Story = {
  name: 'Controlled CSFv3',
  args: {
    controlled: true,
    value: 0,
  },
};

export const ControlledCSFv2: Story = (args) => <Counter {...args} />;
ControlledCSFv2.storyName = 'Controlled CSFv2';
ControlledCSFv2.args = {
  ...ControlledCSFv3.args,
};
