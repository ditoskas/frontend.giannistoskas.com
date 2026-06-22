import React, { useState, useEffect } from "react";

interface GalleryImage {
  filename: string;
  thumb: string;
  full: string;
  prev: string;
  next: string;
}

interface GalleryViewProps {
  image: GalleryImage | undefined;
}

const GalleryView: React.FC<GalleryViewProps> = ({ image }) => {
  const [loaded, setLoaded] = useState(false);
  const [src, setSrc] = useState(image?.full);

  useEffect(() => {
    setLoaded(false);
    setSrc(image?.full);
  }, [image]);

  if (!image) return null;

  return (
    <div className="flex items-center justify-center w-full h-full">
      {!loaded && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-primary opacity-40 text-[16px] tracking-[0.2em]">
            LOADING…
          </div>
        </div>
      )}
      <img
        key={image.filename}
        src={src}
        alt={image.filename}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setSrc(`https://picsum.photos/seed/${image.filename}/900/600`);
        }}
        className={`max-w-full max-h-full object-contain block m-auto transition-opacity duration-800 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default GalleryView;