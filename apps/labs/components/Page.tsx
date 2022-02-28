import React from 'react';
import SbEditable from 'storyblok-react';
import Component from './blocks';

const Page = ({ body = [] }) =>
  body ? (
    <SbEditable content={body}>
      {body.map((blok) => (
        <Component blok={blok} key={blok._uid} />
      ))}
    </SbEditable>
  ) : null;

export default Page;
