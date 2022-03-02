export enum StoryblokBridgeEvents {
  Input = 'input',
  Change = 'change',
  Published = 'published',
  EnterEditmode = 'enterEditmode',
}

export type TStoryblokBridgeInputEventPayload = {
  action: StoryblokBridgeEvents.Input;
  story: unknown;
};

export type TStoryblokBridgeChangeEventPayload = {
  action: StoryblokBridgeEvents.Change;
  reload: boolean;
  slug: string;
  storyId: string;
  slugChanged: boolean;
};

export type TStoryblokBridgePublishedEventPayload = {
  action: StoryblokBridgeEvents.Published;
} & TStoryblokBridgeChangeEventPayload;

export type TStoryBlokBridgeEnterEditmodeEventPayload = {
  action: StoryblokBridgeEvents.EnterEditmode;
  reload: true;
  storyId: string;
  componentNames: Record<string, string>;
};

export type TStoryblokBridgeOptions = {
  resolveRelations: string[];
  language?: string;
  customParent?: string;
  preventClicks?: boolean;
};

export interface IStoryblokBridgeInstance {
  on(
    event: StoryblokBridgeEvents.Input,
    callback: (event: TStoryblokBridgeInputEventPayload) => void,
  ): void;
  on(
    event: StoryblokBridgeEvents.Change,
    callback: (event: TStoryblokBridgeChangeEventPayload) => void,
  ): void;
  on(
    event: StoryblokBridgeEvents.EnterEditmode,
    callback: (event: TStoryBlokBridgeEnterEditmodeEventPayload) => void,
  ): void;
  on(events: StoryblokBridgeEvents[], callback: () => void): void;
}

export interface IStoryblokBridge {
  new (options: TStoryblokBridgeOptions): IStoryblokBridgeInstance;
}
