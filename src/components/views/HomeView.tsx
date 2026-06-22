import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

const HomeView: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="view-container">
      <div className={`view-content ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src={logo}
          alt="Giannis Design — Interior Designer"
          className="max-w-[60%] max-h-[55%] object-contain"
        />
      </div>
    </div>
  );
};

export default HomeView;