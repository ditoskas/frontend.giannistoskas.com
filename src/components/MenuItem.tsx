import React, { useState } from "react";

interface MenuItemProps {
  url: string;
  image: string;
  hover: string;
  alt: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ url, image, hover, alt }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={url} 
      style={{ all: "unset", cursor: "pointer" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={alt}
    >
      <img 
        src={isHovered ? hover : image}
        title={alt}
        alt={alt}
        style={{ display: "block" }} 
      />
    </a>
  );
};

export default MenuItem;
