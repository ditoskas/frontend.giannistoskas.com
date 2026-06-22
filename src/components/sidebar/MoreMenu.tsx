import React, { useState } from "react";

// Import images
import aboutImg from "../../assets/more-menu/about.png";
import aboutHoverImg from "../../assets/more-menu/about_over.png";
import contactImg from "../../assets/more-menu/contact.png";
import contactHoverImg from "../../assets/more-menu/contact_over.png";

interface MenuItemData {
  image: string;
  hover: string;
  alt: string;
  onClick?: () => void;
}

interface MoreMenuProps {
  onNavigate: (dest: "home" | "gallery" | "about" | "contact") => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ onNavigate }) => {
  const menuItems: MenuItemData[] = [
    {
      image: aboutImg,
      hover: aboutHoverImg,
      alt: "About",
      onClick: () => onNavigate("about"),
    },
    {
      image: contactImg,
      hover: contactHoverImg,
      alt: "Contact",
      onClick: () => onNavigate("contact"),
    },
  ];

  return (
    <div
      className="more-menu"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {menuItems.map((item, index) => (
        <MoreMenuItem key={index} item={item} />
      ))}
    </div>
  );
};

const MoreMenuItem: React.FC<{ item: MenuItemData }> = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={item.onClick}
    >
      <img
        src={hovered ? item.hover : item.image}
        alt={item.alt}
        style={{ display: "block" }}
      />
    </div>
  );
};

export default MoreMenu;
