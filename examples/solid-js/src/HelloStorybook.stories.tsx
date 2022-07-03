import type { ComponentMeta, ComponentStory } from '@storybook/solid-js';
import HelloStorybook from './HelloStorybook';

export default {
  title: 'Hello Storybook',
  component: HelloStorybook,
} as ComponentMeta<typeof HelloStorybook>;

type Story = ComponentStory<typeof HelloStorybook>;

export const Standard: Story = {
  args: {},
};
