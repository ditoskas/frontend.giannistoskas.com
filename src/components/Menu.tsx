import React from "react";
import MenuItem from "./MenuItem";

interface MenuDataItem {
  url: string;
  image: string;
  hover: string;
}

interface MenuProps {
  items: MenuDataItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {items.map((item, index) => (
        <li key={index} style={{ margin: 0, padding: 0 }}>
          <MenuItem 
            url={item.url} 
            image={item.image} 
            hover={item.hover} 
          />
        </li>
      ))}
    </ul>
  );
};

export default Menu;
