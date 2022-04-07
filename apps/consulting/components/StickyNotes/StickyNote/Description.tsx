import { FC } from 'react';
import clsx from 'clsx';

import { createMarkup } from '@quansight/shared/ui-components';

import { getTextColor, getTextSize } from './utils';

import { StickyNoteColor, StickyNoteSize } from './types';
import { TRichText } from '@quansight/shared/types';

type TDescription = {
  text: TRichText;
  size: StickyNoteSize;
  variant: StickyNoteColor;
};

export const Description: FC<TDescription> = ({ text, size, variant }) => (
  <div
    dangerouslySetInnerHTML={createMarkup(text)}
    className={clsx('font-heading', getTextSize(size), getTextColor(variant))}
  ></div>
);
