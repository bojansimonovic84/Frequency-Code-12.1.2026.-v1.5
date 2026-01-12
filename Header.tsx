import React from 'react';
import Logo from './Logo';
import Button from './ui/Button';

interface HeaderProps {
  onStart: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStart }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-8 px-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-8">
          <Button onClick={onStart} className="hidden sm:block text-xs md:text-sm font-bold tracking-[0.2em]">
            UNLOCK YOUR CODE
          </Button>
          <button className="text-amber-500/60 hover:text-amber-400 transition-all transform hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;