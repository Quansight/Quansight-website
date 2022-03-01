import React, { FC } from 'react';
import SbEditable from 'storyblok-react';
import { BlokProvider } from '../BlokProvider/BlokProvider';
import { TBlok } from '../../types/storyblok/blok';

type TPageProps = {
  body: TBlok[];
};

const Page: FC<TPageProps> = ({ body = [] }) => {
  return body.map((blok) => (
    <SbEditable content={blok} key={blok._uid}>
      <BlokProvider blok={blok} />
    </SbEditable>
  ));
};

export default Page;
