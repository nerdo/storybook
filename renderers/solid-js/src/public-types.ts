import type {
  Args,
  ComponentAnnotations,
  StoryAnnotations,
  AnnotatedStoryFn,
} from '@storybook/csf';
import { Component, ComponentProps } from 'solid-js';
import { SolidFramework } from './types';

export type { Args, ArgTypes, Parameters, StoryContext } from '@storybook/csf';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<TArgs = Args> = ComponentAnnotations<SolidFramework, TArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<SolidFramework, TArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<SolidFramework, TArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<TArgs = Args> = StoryObj<TArgs>;

/**
 * For the common case where a component's stories are simple components that receives args as props:
 *
 * ```tsx
 * export default { ... } as ComponentMeta<typeof Button>;
 * ```
 */
export type ComponentMeta<T extends Component> = Meta<ComponentProps<T>>;

/**
 * For the common case where a (CSFv2) story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStoryFn<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStoryFn<T extends Component> = StoryFn<ComponentProps<T>>;

/**
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStoryObj<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStoryObj<T extends Component> = StoryObj<ComponentProps<T>>;

/**
 * For the common case where a (CSFv3) story is a simple component that receives args as props.
 * It can either be a CSFv3 object, or CSVv2 function...
 *
 * ```tsx
 * const MyObjStory: ComponentStory<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 *
 * const MyFnStory: ComponentStory<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStory<T extends Component> = ComponentStoryObj<T> | ComponentStoryFn<T>;
