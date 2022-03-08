/* eslint-disable */

import React, { FC } from 'react';

import ButtonLink from '../ButtonLink';

export type QhubProptypes = {
  color: any,
  image: any,
  header: string,
  text: string,
  btnText?: string,
  btnUrl?: string,
};

export const Qhub: FC<QhubProptypes> = ({ color, image, header, text, btnText, btnUrl }) => (
    <section>
      <div>
        {header}
        {text}
        <ButtonLink color={'violet'} background={false} text={btnText} link={btnUrl} />
      </div>
      <img src={image} alt={header} />
    </section>
);
