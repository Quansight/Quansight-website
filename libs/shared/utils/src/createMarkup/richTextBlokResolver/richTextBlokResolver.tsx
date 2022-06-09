import { ReactElement } from 'react';

import { getRichTextBlokPropsByType } from './getRichTextBlokPropsByType/getRichTextBlokPropsByType';
import { richTextBloksMap } from './richTextBloks/richTextBloksMap';
import { TRichTextRawBlok } from './richTextRawBlok/richTextRawBlok';
import { isValidString } from './utils/isValidString';

export const richTextBlokResolver = (blok: TRichTextRawBlok): ReactElement => {
  if (richTextBloksMap[blok?.component]) {
    const Component = richTextBloksMap[blok.component];
    const componentProps = getRichTextBlokPropsByType(blok);
    if (componentProps) return <Component {...componentProps} />;
  }
  const componentName = isValidString(blok?.component)
    ? blok.component
    : 'Unknown';
  return (
    <p className="text-[1.6rem] text-center text-red">
      The component
      <span className="font-extrabold">{` ${componentName} `}</span>
      has not been created yet.
    </p>
  );
};
