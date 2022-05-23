import { FC, useEffect, useState } from 'react';

import clsx from 'clsx';

import { Picture } from '../Picture/Picture';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderMenu } from './Menu/HeaderMenu';
import { THeaderProps } from './types';

export const Header: FC<THeaderProps> = ({
  logo,
  navigation,
  bookACallLinkText,
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    if (isNavigationOpen) document.body.classList.add('navbar-open');
    if (!isNavigationOpen) document.body.classList.remove('navbar-open');
  }, [isNavigationOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-20 text-white">
      <HeaderMenu
        logo={logo}
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
      />
    </header>
  );
};

export default Header;
// <header className="fixed inset-x-0 top-0 z-20 text-white">
//     <HeaderMenu
//       logo={logo}
//       isNavigationOpen={isNavigationOpen}
//       setIsNavigationOpen={setIsNavigationOpen}
//     />
//     <div
//       className={clsx(
//         'absolute inset-0 z-30 px-[2rem] pt-[10rem] w-screen h-screen bg-black transition-transform duration-300 ease-in-out',
//         isNavigationOpen ? 'block' : 'hidden',
//       )}
//     >
//       <div className="overflow-y-auto pb-[10rem] h-full">
//         <ul className="flex flex-col gap-[2rem] justify-start items-center">
//           {[...Array(15).keys()].map((item) => (
//             <li
//               className="py-[1rem] w-full text-[1.6rem] text-center bg-blue-500"
//               key={item}
//             >
//               <a href="/">{item}</a>
//             </li>
//           ))}
//         </ul>
//         <button
//           className="py-[1rem] px-[2rem] mt-[6.2rem] bg-pink"
//           onClick={() => console.log('CALL')}
//         >
//           BOOK A CALL
//         </button>
//       </div>
//     </div>
//   </header>
