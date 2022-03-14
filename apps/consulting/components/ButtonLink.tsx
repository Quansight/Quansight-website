import { FC } from 'react';

export type TStoryblokLinkProps = {
  id: number,
  url: string
  linktype: 'url',
  fieldtype: 'multilink',
  cashed_url?: string
}

export type TButtonLinkProps = {
  type: 'bordered' | 'full',
  color: string,
  text: string,
  link: TStoryblokLinkProps
}

const variantStyles = {
  bordered: `border-2 border-solid`,
  white: `border-white text-white`,
  violet: `border-violet text-violet`,
  triangle: { white: `border-l-white`, violet: `border-l-violet`}
};

export const ButtonLink: FC<TButtonLinkProps> = ({ type, color, text, link }) => (
  <a 
    href={link.url} 
    className={`
      flex items-center justify-start w-fit px-9 py-3 font-bold text-base
      ${variantStyles[type]} ${variantStyles[color]}
    `}
  >
    {text}
    <span className={`
      inline-block w-0 h-0 ml-2 border-y-solid border-y-8 border-y-transparent border-l-solid border-l-8
      ${variantStyles.triangle[color]}
    `}/>
  </a>
);
