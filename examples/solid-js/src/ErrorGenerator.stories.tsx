import type { ComponentMeta, ComponentStory } from '@storybook/solid-js';
import ErrorGenerator from './ErrorGenerator';

export default {
  component: ErrorGenerator,
} as ComponentMeta<typeof ErrorGenerator>;

type Story = ComponentStory<typeof ErrorGenerator>;
export const ErrorBoundary: Story = {
  args: {
    selfDestructSeconds: 10,
    errorMessage: undefined,
  },
};
