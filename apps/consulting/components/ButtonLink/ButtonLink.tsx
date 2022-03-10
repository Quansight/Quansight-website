/* eslint-disable */

import React from 'react';

export type TButtonLinkProps = {
  color: 'white' | 'violet' | 'black',
  background: boolean,
  border: boolean,
  triangle: boolean,
  text: string,
  link: string
};

const ButtonLink = ({ color, background, border, triangle, text, link }: TButtonLinkProps) => {
  const triangleStyles = `w-0 h-0 ml-2 border-solid border-${color} b-8 b-l-0`;
  const backgroundStyle = background && `bg-violet`;
  const borderStyle = border && `border-2 border-solid border-${color}`;
  const buttonStyles = `px-9 py-3 ${borderStyle} ${backgroundStyle} font-bold text-base text-${color}`;

  return (
    <a href={link} className={buttonStyles}>
      {text}
      { triangle && <span className={triangleStyles}/> }
    </a>
  )
};

ButtonLink.defaultProps = {
  color: 'white',
  background: true,
  border: true,
  triangle: true,
  text: 'Learn more'
};

export default ButtonLink;
