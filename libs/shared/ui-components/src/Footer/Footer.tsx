import { FC } from 'react';

import { FooterColumnProvider } from './FooterColumnProvider/FooterColumnProvider';
import { FooterCopyright } from './FooterCopyright';
import { TFooterProps } from './types';

export const Footer: FC<TFooterProps> = ({
  columns,
  policyAndConditions,
  copyright,
}) => (
  <footer className="flex justify-center items-center text-black bg-white xl:text-white xl:bg-black">
    <div className="px-9 pt-24 pb-20 w-full sm:px-16 sm:pb-5 xl:px-52 xl:pt-[6.2rem] xl:pb-[3.7rem] max-w-layout">
      <section className="grid grid-cols-2 gap-[3.2rem] sm:gap-24 lg:grid-cols-4 lg:gap-[3rem] xl:gap-[8rem]">
        {columns.map((column) => (
          <FooterColumnProvider data={column} key={column._uid} />
        ))}
      </section>
      <FooterCopyright
        policyAndConditions={policyAndConditions}
        copyright={copyright}
      />
    </div>
  </footer>
);

export default Footer;
