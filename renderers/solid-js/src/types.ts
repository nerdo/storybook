import type { Component, JSX } from 'solid-js';

export type { RenderContext } from '@storybook/core-client';

export type StoryFnSolidReturnType = JSX.Element;

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface IStorybookStory {
  name: string;
  render: (context: any) => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export type SolidFramework = {
  component: Component<any>;
  storyResult: StoryFnSolidReturnType;
};
