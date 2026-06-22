import React, { useState } from "react";
import logoSidebar from "../../assets/logo-sidebar.png";
import MainMenu from "./MainMenu";
import MoreMenu from "./MoreMenu";
import MenuToggler from "./MenuToggler";

interface SidebarProps {
  onHomeClick: () => void;
  onNextClick: () => void;
  onPrevClick: () => void;
  onToggleThumbs: () => void;
  onToggleMenu: () => void;
  onNavigate: (dest: "home" | "gallery" | "about" | "contact") => void;
  onToggleMusic: () => void;
  thumbsVisible: boolean;
  menuOpen: boolean;
  isPlaying: boolean;
  page: string;
}

interface IconBtnProps {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

function IconBtn({ title, onClick, children, className = "" }: IconBtnProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`bg-none border-none cursor-pointer py-2 flex items-center justify-center text-primary hover:text-primary-hover transition-colors duration-200 w-[58px] h-[52px] ${className}`}
    >
      {children}
    </button>
  );
}

const IconSoundOn = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <polygon points="3,7 9,7 14,3 14,19 9,15 3,15" fill={color} />
    <path d="M16 8 Q19 11 16 14" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M18 5 Q23 11 18 17" stroke={color} strokeWidth="1.8" fill="none" />
  </svg>
);
const IconSoundOff = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <polygon points="3,7 9,7 14,3 14,19 9,15 3,15" fill={color} />
    <line x1="17" y1="8" x2="22" y2="14" stroke={color} strokeWidth="1.8" />
    <line x1="22" y1="8" x2="17" y2="14" stroke={color} strokeWidth="1.8" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({
  onHomeClick,
  onNextClick,
  onPrevClick,
  onToggleThumbs,
  onToggleMenu,
  onNavigate,
  onToggleMusic,
  thumbsVisible,
  menuOpen,
  isPlaying,
}) => {
  return (
    <div className="h-full bg-bg-dark border-l border-bg-sidebar flex flex-col items-center flex-none">
      {/* Logo / Home button */}
      <div
        className="cursor-pointer flex flex-col items-center"
        onClick={onHomeClick}
        title="Home"
      >
        <img
          className="pt-[18px] px-[10px] pb-[10px]"
          src={logoSidebar} 
          alt="Giannis Design Logo"
        />
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center justify-center">
        
        {/* Main Menu */}
        <div 
          className={`overflow-hidden transition-all duration-400 ease-in-out ${
            menuOpen 
              ? "max-h-0 opacity-0 duration-0" 
              : "max-h-[300px] opacity-100 delay-300"
          }`}
        >
          <MainMenu 
            onNextClick={onNextClick}
            onPrevClick={onPrevClick}
            onToggleThumbs={onToggleThumbs}
            thumbsVisible={thumbsVisible}
          />
        </div>

        <MenuToggler isOpen={menuOpen} onClick={onToggleMenu} />

        {/* More Menu */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            menuOpen 
              ? "max-h-[300px] opacity-100 translate-y-0" 
              : "max-h-0 opacity-0 translate-y-full"
          }`}
        >
          <MoreMenu onNavigate={onNavigate} />
        </div>

      </div>

      {/* Music Toggle */}
      <div className="pb-[14px]">
        <IconBtn
          title={isPlaying ? "Stop music" : "Play music"}
          onClick={onToggleMusic}
        >
          {isPlaying ? <IconSoundOff /> : <IconSoundOn />}
        </IconBtn>
      </div>
    </div>
  );
};

export default Sidebar;