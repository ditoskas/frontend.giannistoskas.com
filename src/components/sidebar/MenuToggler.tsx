import React, { useState } from "react";

// Import images
import moreImg from "../../assets/toggler-menu/more.png";
import moreHoverImg from "../../assets/toggler-menu/more_over.png";
import moreCloseImg from "../../assets/toggler-menu/more_close.png";
import moreCloseHoverImg from "../../assets/toggler-menu/more_close_over.png";

interface MenuTogglerProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuToggler: React.FC<MenuTogglerProps> = ({ isOpen, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const getCurrentImage = () => {
    if (isOpen) {
      return hovered ? moreCloseHoverImg : moreCloseImg;
    }
    return hovered ? moreHoverImg : moreImg;
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <img
        src={getCurrentImage()}
        alt={isOpen ? "Close Menu" : "Open Menu"}
        style={{ display: "block" }}
      />
    </div>
  );
};

export default MenuToggler;
