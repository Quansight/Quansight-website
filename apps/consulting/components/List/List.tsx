import { FC } from 'react';

import { ButtonColor, ButtonLink } from '@quansight/shared/ui-components';

import ListItem, { TListItemProps } from './ListItem';

export type TListProps = {
  grid: TListItemProps[];
  linkTitle: string;
  linkUrl: string;
};

export const List: FC<TListProps> = ({ grid, linkTitle, linkUrl }) => {
  return (
    <section>
      Hello
      {grid.map((props) => (
        <ListItem {...props} key={props._uid} />
      ))}
      <div>
        <ButtonLink
          isFull
          isTriangle
          text={linkTitle}
          url={linkUrl}
          color={ButtonColor.White}
        />
      </div>
    </section>
  );
};
