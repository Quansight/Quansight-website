import { ReactElement } from 'react';

import { ErrorNotificatoin } from './components/ErrorNotification/ErrorNotificatoin';
import { getRichTextBlokPropsByType } from './getRichTextBlokPropsByType/getRichTextBlokPropsByType';
import { richTextBloksMap } from './richTextBloks/richTextBloksMap';
import { TRichTextRawBlok } from './richTextRawBlok/richTextRawBlok';

export const richTextBlokResolver = (blok: TRichTextRawBlok): ReactElement => {
  if (richTextBloksMap[blok?.component]) {
    const Component = richTextBloksMap[blok.component];
    const componentProps = getRichTextBlokPropsByType(blok);
    if (componentProps) return <Component {...componentProps} />;
  }

  return <ErrorNotificatoin componentName={blok?.component} />;
};
