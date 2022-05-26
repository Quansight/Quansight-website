import { useEffect, useState } from 'react';

import StoryblokClient from 'storyblok-js-client';

import { IStoryblokBridge, StoryblokBridgeEvents } from '../types/storyblok';

interface CustomWindow extends Window {
  StoryblokBridge: IStoryblokBridge;
}

declare const window: CustomWindow;

export const Storyblok = new StoryblokClient({
  accessToken: process.env['NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN'],
  cache: {
    clear: 'auto',
    type: 'memory',
  },
});

export const useStoryblok = <PageItem>(
  originalStory: PageItem,
  preview: boolean,
  onLoadPageItem: (slug: string) => Promise<PageItem>,
  locale?: string,
): PageItem | null => {
  const [story, setStory] = useState<PageItem | null>(originalStory);

  const initEventListeners = (): void => {
    const { StoryblokBridge } = window;

    if (StoryblokBridge) {
      const storyblokInstance = new StoryblokBridge({
        resolveRelations: [],
        language: locale,
      });

      storyblokInstance.on(
        [StoryblokBridgeEvents.Change, StoryblokBridgeEvents.Published],
        () => {
          console.log('publish of change event');
          window.location.reload();
        },
      );

      storyblokInstance.on(StoryblokBridgeEvents.Input, (event) => {
        setStory(event.story as PageItem);
      });

      storyblokInstance.on(
        StoryblokBridgeEvents.EnterEditmode,
        async (event) => {
          if (!event.storyId) {
            return;
          }

          if (event.storyId && !story) {
            const pageItem = await onLoadPageItem(event.storyId);
            // const { data } = await Api.getPageItem<
            //   PageReturnType,
            //   PageItemVariables
            // >(pageQuery, {
            //   slug: event.storyId,
            // });
            setStory(pageItem);
          }
        },
      );
    }
  };

  function addBridge(callback: () => void): void {
    const hasStoryblokBridgeScript = document.getElementById('storyblokBridge');

    if (!hasStoryblokBridgeScript) {
      const script = document.createElement('script');
      script.src = '//app.storyblok.com/f/storyblok-v2-latest.js';
      script.id = 'storyblokBridge';
      document.body.appendChild(script);
      script.onload = () => {
        callback();
      };
    } else {
      callback();
    }
  }

  useEffect(() => {
    if (preview) {
      addBridge(initEventListeners);
    }
  }); // eslint-disable-line react-hooks/exhaustive-deps -- TODO

  useEffect(() => {
    if (!preview) {
      setStory(originalStory);
    }
  }, [originalStory, preview]);

  return story;
};

export default Storyblok;
