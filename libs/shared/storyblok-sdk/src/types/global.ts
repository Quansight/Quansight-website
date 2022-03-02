import { IStoryblokBridge } from './storyblok';

export {};

declare global {
  interface Window {
    StoryblokBridge: IStoryblokBridge;
  }
}
