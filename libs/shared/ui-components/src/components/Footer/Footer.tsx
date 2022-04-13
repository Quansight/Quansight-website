import { FC } from 'react';
import { TFooterProps } from './types';

export const Footer: FC<TFooterProps> = ({
  columns,
  policyAndConditions,
  copyright,
}) => {
  console.log(columns);
  console.log(policyAndConditions);
  console.log(copyright);

  return <footer>Footer</footer>;
};

export default Footer;
