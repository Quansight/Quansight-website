import { FC } from 'react';

import { ButtonLink } from '@quansight/shared/ui-components';

export type TBoardButtonProps = {
  buttonTitle: string;
  buttonUrl: string;
};

const BoardButton: FC<TBoardButtonProps> = ({ buttonTitle, buttonUrl }) => {
  return (
    <div className="
      z-10 mx-auto mt-[6.5rem] 
      sm:flex sm:justify-center sm:items-center sm:mx-0 sm:mt-0 sm:bg-green
    ">
      <ButtonLink isFull isTriangle text={buttonTitle} url={buttonUrl} color='white' />
    </div>
  );
};

export default BoardButton;
