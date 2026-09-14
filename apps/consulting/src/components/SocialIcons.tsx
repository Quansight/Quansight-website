import type { FC } from 'react';

type SocialIconsProps = {
  links: { text: string; href: string; icon: string; iconAlt: string }[];
};

export const SocialIcons: FC<SocialIconsProps> = ({ links }) => (
  <ul className="flex flex-wrap gap-6">
    {links.map((link) => (
      <li key={link.href}>
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="block relative w-8 h-8"
        >
          <span className="sr-only">{link.text}</span>
          <img
            src={link.icon}
            alt={link.iconAlt}
            aria-hidden="true"
            className="object-contain w-full h-full"
          />
        </a>
      </li>
    ))}
  </ul>
);
