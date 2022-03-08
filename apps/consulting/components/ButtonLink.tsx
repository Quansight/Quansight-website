/* eslint-disable */

import React from 'react';

export type ButtonLinkProptypes = {
  color: 'white' | 'violet' | 'black',
  background: boolean,
  border: boolean,
  triangle: boolean,
  text: string,
  link: string
};

const ButtonLink = ({ color, background, border, triangle, text, link }: ButtonLinkProptypes) => {
  const triangleStyles = `w-0 h-0 ml-2 border-solid border-${color} b-8 b-l-0`;
  const backgroundStyle = background && `bg-violet`;
  const borderStyle = border && `border-2 border-solid border-${color}`;
  const buttonStyles = `px-9 py-3 ${borderStyle} ${backgroundStyle} text-${color}`;

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
