import type { ComponentMeta, ComponentStory } from '@storybook/solid-js';
import Cleanup from './Cleanup';

export default {
  component: Cleanup,
} as ComponentMeta<typeof Cleanup>;

type Story = ComponentStory<typeof Cleanup>;

export const OnCleanupGetsCalled: Story = {};
