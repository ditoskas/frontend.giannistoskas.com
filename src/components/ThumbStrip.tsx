import React, { useEffect, useRef } from "react";

interface GalleryImage {
  filename: string;
  thumb: string;
  full: string;
  prev: string;
  next: string;
}

interface ThumbStripProps {
  images: GalleryImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const ThumbStrip: React.FC<ThumbStripProps> = ({ images, selectedIndex, onSelect }) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("li");
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <div className="w-[140px] h-full overflow-y-auto overflow-x-hidden bg-bg-thumb border-l border-border-thumb scrollbar-none">
      <ul ref={listRef} className="list-none m-0 p-0 w-[140px]">
        {images.map((img, i) => (
          <li
            key={img.filename}
            onClick={() => onSelect(i)}
            className={`w-[140px] h-[90px] m-0 p-0 cursor-pointer overflow-hidden flex items-center justify-center ${i === selectedIndex ? 'bg-primary' : 'bg-transparent'}`}
          >
            <img
              src={img.thumb}
              alt={img.filename}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${img.filename}/140/90`;
              }}
              className={`w-full h-full object-cover block box-border transition-[border] duration-150 ${i === selectedIndex ? 'border-[5px] border-primary' : 'border-none'}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThumbStrip;