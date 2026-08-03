import { useState, useEffect, useRef } from 'react';

type NavItem = { text: string; href: string };

export function SiteHeaderMobile({
  logoSrc,
  logoAlt,
  navigation,
}: {
  logoSrc: string;
  logoAlt: string;
  navigation: NavItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') setIsOpen(false);
    };
    const onFocus = ({ target }: FocusEvent) => {
      if (container.current && !container.current.contains(target as Node))
        setIsOpen(false);
    };
    if (isOpen) {
      document.body.classList.add('navbar-open');
      window.addEventListener('keydown', onKey);
      document.addEventListener('focusin', onFocus);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.removeEventListener('focusin', onFocus);
      };
    }
    document.body.classList.remove('navbar-open');
  }, [isOpen]);

  return (
    <div ref={container} className="sm:hidden">
      {/* menu bar */}
      <div className="flex fixed inset-x-0 top-0 z-40 justify-between items-center py-[0.5rem] px-[2rem] bg-black">
        <a href="/" aria-label="Go to home page" className="w-[27.3rem] h-[7.373rem] shrink-0 flex items-center">
          <img src={logoSrc} alt={logoAlt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </a>
        <button
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen(!isOpen)}
          className="w-[3rem] h-[3rem] cursor-pointer"
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true" className="flex overflow-hidden relative flex-col gap-[0.6rem] justify-center items-center w-full h-full">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block w-[3rem] h-[0.3rem] bg-white transition-all duration-500 ease-in-out ${
                  i === 0
                    ? `absolute ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-[0.9rem]'}`
                    : i === 1
                    ? `${isOpen ? 'opacity-0 -translate-x-[2rem]' : ''}`
                    : `absolute ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-[0.9rem]'}`
                }`}
              />
            ))}
          </span>
        </button>
      </div>

      {/* overlay nav */}
      <nav
        id="mobile-menu"
        className={`fixed inset-0 z-30 pt-[8rem] w-screen h-screen bg-black text-white overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ul className="flex flex-col justify-start items-center px-[2rem] pt-[1.8rem]">
          {navigation.map((item) => (
            <li key={item.href} className="w-full border-b border-b-white">
              <a
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-[1.6rem] px-[2rem] w-full text-[1.7rem] font-extrabold leading-[2.825rem] capitalize font-heading"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
