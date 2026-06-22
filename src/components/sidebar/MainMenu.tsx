import React, { useState } from "react";

// Import images
import rightImg from "../../assets/main-menu/right.png";
import rightHoverImg from "../../assets/main-menu/right_over.png";
import leftImg from "../../assets/main-menu/left.png";
import leftHoverImg from "../../assets/main-menu/left_over.png";
import thumbsImg from "../../assets/main-menu/thumbs.png";
import thumbsHoverImg from "../../assets/main-menu/thumbs_over.png";

interface MenuItemData {
  url: string;
  image: string;
  hover: string;
  alt: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface MainMenuProps {
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onToggleThumbs?: () => void;
  thumbsVisible?: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onNextClick,
  onPrevClick,
  onToggleThumbs,
  thumbsVisible = false,
}) => {
  const menuItems: MenuItemData[] = [
    {
      url: "",
      image: rightImg,
      hover: rightHoverImg,
      alt: "Next Image",
      onClick: onNextClick,
    },
    {
      url: "",
      image: leftImg,
      hover: leftHoverImg,
      alt: "Previous Image",
      onClick: onPrevClick,
    },
    {
      url: "",
      image: thumbsImg,
      hover: thumbsHoverImg,
      alt: "Show/Hide Thumbnails",
      isActive: thumbsVisible,
      onClick: onToggleThumbs,
    },
  ];

  return (
    <div
      className="main-menu"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {menuItems.map((item, index) => (
        <MainMenuItem key={index} item={item} />
      ))}
    </div>
  );
};

const MainMenuItem: React.FC<{ item: MenuItemData }> = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={item.url}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={(e) => {
        if (item.onClick) {
          e.preventDefault();
          item.onClick();
        }
      }}
    >
      <img
        src={(hovered || item.isActive) ? item.hover : item.image}
        alt={item.alt}
        style={{ display: "block" }}
      />
    </a>
  );
};

export default MainMenu;
