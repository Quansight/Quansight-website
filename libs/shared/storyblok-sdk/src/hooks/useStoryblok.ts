import { useEffect, useState } from 'react';
import { PageItem } from '../api/types/graphql';

import { apolloClient } from '../api/sdk/clients/apolloClient';
import { getSdk } from '../api/sdk/getSdk';

import StoryblokClient from 'storyblok-js-client';

// @TODO fix types

const Storyblok = new StoryblokClient({
  accessToken: process.env['NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN'],
  cache: {
    clear: 'auto',
    type: 'memory',
  },
});

export const dataSdk = getSdk(apolloClient);

export const useStoryblok = (
  originalStory: PageItem,
  preview: boolean,
  locale?: string,
): PageItem => {
  const [story, setStory] = useState<PageItem>(originalStory);

  const handleInput = (event: any, callback: any) => {
    callback(event);
  };

  const inputCallback = (event: any) => {
    setStory(event.story);
  };

  const handleEnterEditMode = async (event: any) => {
    if (!event.storyId) {
      return;
    }

    if (event.storyId && !story) {
      const page = await dataSdk.getPageItem({ slug: event.storyId });

      const newStory = page;

      setStory(newStory);
    }
  };

  const initEventListeners = () => {
    const { StoryblokBridge } = window as any;

    if (typeof StoryblokBridge !== 'undefined') {
      const storyblokInstance = new StoryblokBridge({
        resolveRelations: [],
        language: locale,
      });

      storyblokInstance.on(['change', 'published'], () => {
        console.log('publish of change event');
        window.location.reload();
      });
      storyblokInstance.on('input', (event: unknown) =>
        handleInput(event, inputCallback),
      );
      storyblokInstance.on('enterEditmode', handleEnterEditMode);
    }
  };

  function addBridge(callback: unknown) {
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
  }, []);

  useEffect(() => {
    !preview && setStory(originalStory);
  }, [originalStory, preview]);

  return story;
};

export default Storyblok;
