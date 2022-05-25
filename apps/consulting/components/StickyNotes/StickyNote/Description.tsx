import { FC } from 'react';

import clsx from 'clsx';

import { TRichText } from '@quansight/shared/types';
import { createMarkup } from '@quansight/shared/utils';

import { StickyNoteColor, StickyNoteSize } from './types';
import { getTextColor, getTextSize } from './utils';

type TDescriptionProps = {
  text: TRichText;
  size: StickyNoteSize;
  variant: StickyNoteColor;
};

export const Description: FC<TDescriptionProps> = ({ text, size, variant }) => (
  <div
    dangerouslySetInnerHTML={createMarkup(text)}
    className={clsx('font-heading', getTextSize(size), getTextColor(variant))}
  ></div>
);
