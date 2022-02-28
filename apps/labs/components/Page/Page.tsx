import React, { FC } from 'react';
import SbEditable from 'storyblok-react';
import { BlokProvider } from '../BlokProvider/BlokProvider';
import { TBlok } from '../../types/storyblok/block';

type TPageProps = {
  body: TBlok[];
};

const Page: FC<TPageProps> = ({ body = [] }) => {
  return body
    ? body.map((blok) => (
        <SbEditable content={blok} key={blok._uid}>
          <BlokProvider blok={blok} />
        </SbEditable>
      ))
    : null;
};

export default Page;
