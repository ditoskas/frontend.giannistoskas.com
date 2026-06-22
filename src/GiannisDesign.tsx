import { useState, useEffect, useRef, useCallback } from "react";
import HomeView from "./components/views/HomeView";
import GalleryView from "./components/views/GalleryView";
import AboutView from "./components/views/AboutView";
import ContactView from "./components/views/ContactView";
import Sidebar from "./components/sidebar/Sidebar";
import ThumbStrip from "./components/ThumbStrip";

// Import audio
import bgSound from "./assets/music/bgsound.mp3";

/* ─────────────────────────── TYPES ─────────────────────────── */

interface GalleryImage {
  filename: string;
  thumb: string;
  full: string;
  prev: string;
  next: string;
}

interface ApiImage {
  id: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
}

interface ApiResponse {
  data: ApiImage[];
}

interface AppSettings {
  "googleAnalyticsId"?: string;
  "reCaptchaSiteKey"?: string;
}

interface SettingsResponse {
  data: AppSettings;
}

/* ─────────────────────────── MAIN APP ─────────────────────────── */

const SLIDE_INTERVAL = 20000;

export default function GiannisDesign() {
  const [page, setPage] = useState<"home" | "gallery" | "about" | "contact">("home");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [thumbsVisible, setThumbsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInternalNavigation = useRef(false);

  // Fetch Gallery Data
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${apiUrl}/api/public/portfolio/main`)
      .then(res => res.json())
      .then((resp: ApiResponse) => {
        if (resp.data && resp.data.length > 0) {
          const mapped: GalleryImage[] = resp.data.map((img, i, arr) => {
            return {
              filename: img.originalName,
              thumb: img.thumbnailUrl,
              full: img.url,
              prev: arr[(i - 1 + arr.length) % arr.length].originalName,
              next: arr[(i + 1) % arr.length].originalName,
            };
          });
          setGalleryImages(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch gallery:", err));
  }, []);

  // Fetch App Settings
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${apiUrl}/api/public/application-settings`)
      .then(res => res.json())
      .then((resp: SettingsResponse) => {
        if (resp.data) {
          setSettings(resp.data);
          
          // Initialize Google Analytics if present
          const gaId = resp.data["googleAnalyticsId"];
          if (gaId) {
            const script1 = document.createElement("script");
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script1);

            const script2 = document.createElement("script");
            script2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `;
            document.head.appendChild(script2);
          }
        }
      })
      .catch(err => console.error("Failed to fetch settings:", err));
  }, []);

  // Sync state with URL hash
  const syncHashToState = useCallback(() => {
    if (isInternalNavigation.current) {
      isInternalNavigation.current = false;
      return;
    }

    const hash = window.location.hash;
    if (!hash) {
      setPage("home");
      setSelectedIdx(0);
    } else if (hash === "#about-us") {
      setPage("about");
      setSelectedIdx(0);
    } else if (hash === "#contact") {
      setPage("contact");
      setSelectedIdx(0);
    } else if (hash.startsWith("#images/")) {
      const filename = decodeURIComponent(hash.replace("#images/", ""));
      if (galleryImages.length > 0) {
        const idx = galleryImages.findIndex(img => img.filename === filename);
        if (idx !== -1) {
          setPage("gallery");
          setSelectedIdx(idx);
        } else {
          setPage("home");
          setSelectedIdx(0);
        }
      }
    }
  }, [galleryImages]);

  useEffect(() => {
    window.addEventListener("hashchange", syncHashToState);
    syncHashToState(); // Initial load
    return () => window.removeEventListener("hashchange", syncHashToState);
  }, [syncHashToState]);

  // Sync state changes to URL hash
  useEffect(() => {
    if (galleryImages.length === 0) return;

    let newHash = "";
    if (page === "home") newHash = "";
    else if (page === "about") newHash = "#about-us";
    else if (page === "contact") newHash = "#contact";
    else if (page === "gallery") {
      newHash = `#images/${galleryImages[selectedIdx].filename}`;
    }

    if (window.location.hash !== newHash) {
      isInternalNavigation.current = true;
      if (newHash === "") {
        history.replaceState(null, "", window.location.pathname);
      } else {
        window.location.hash = newHash;
      }
    }
  }, [page, selectedIdx, galleryImages]);

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio(bgSound);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle playing state
  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play().catch(err => {
          console.warn("Audio autoplay blocked or failed:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing]);

  const startSlideshow = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (galleryImages.length === 0) return;
    timerRef.current = window.setInterval(() => {
      setSelectedIdx((i) => (i + 1) % galleryImages.length);
    }, SLIDE_INTERVAL);
  }, [galleryImages]);

  const stopSlideshow = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (page === "gallery") startSlideshow();
    else stopSlideshow();
    return stopSlideshow;
  }, [page, startSlideshow, stopSlideshow]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (page !== "gallery" || galleryImages.length === 0) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setSelectedIdx((i) => (i - 1 + galleryImages.length) % galleryImages.length);
        startSlideshow();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setSelectedIdx((i) => (i + 1) % galleryImages.length);
        startSlideshow();
      }
    };
    window.addEventListener("keyup", handler);
    return () => window.removeEventListener("keyup", handler);
  }, [page, startSlideshow, galleryImages]);

  const goHome = () => {
    stopSlideshow();
    setSelectedIdx(0);
    setPage("home");
    setMenuOpen(false);
  };

  const goNext = () => {
    if (galleryImages.length === 0) return;
    setPage("gallery");
    setSelectedIdx((i) => (i + 1) % galleryImages.length);
    startSlideshow();
  };

  const goPrev = () => {
    if (galleryImages.length === 0) return;
    setPage("gallery");
    setSelectedIdx((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    startSlideshow();
  };

  const selectThumb = (i: number) => {
    setPage("gallery");
    setSelectedIdx(i);
    startSlideshow();
  };

  const navigateTo = (dest: "home" | "gallery" | "about" | "contact") => {
    stopSlideshow();
    if (dest !== "gallery") {
      setSelectedIdx(0);
    }
    setPage(dest);
  };

  const toggleThumbs = () => setThumbsVisible((v) => !v);
  const toggleMenu = () => setMenuOpen((v) => !v);

  useEffect(() => {
    const noCtx = (e: MouseEvent) => e.preventDefault();
    const noDrag = (e: DragEvent) => { if ((e.target as HTMLElement).tagName === "IMG") e.preventDefault(); };
    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("dragstart", noDrag);
    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.removeEventListener("dragstart", noDrag);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-bg-dark flex overflow-hidden font-sans select-none">
      <div className="flex-1 h-full overflow-hidden relative">
        {page === "home" && <HomeView />}
        {page === "gallery" && galleryImages.length > 0 && (
          <GalleryView image={galleryImages[selectedIdx]} />
        )}
        {page === "about" && <AboutView />}
        {page === "contact" && (
          <ContactView recaptchaKey={settings?.["reCaptchaSiteKey"]} />
        )}
      </div>

      {thumbsVisible && galleryImages.length > 0 && (
        <ThumbStrip
          images={galleryImages}
          selectedIndex={selectedIdx}
          onSelect={selectThumb}
        />
      )}

      <Sidebar
        onHomeClick={goHome}
        onNextClick={goNext}
        onPrevClick={goPrev}
        onToggleThumbs={toggleThumbs}
        onToggleMenu={toggleMenu}
        onNavigate={navigateTo}
        onToggleMusic={() => setPlaying(!playing)}
        thumbsVisible={thumbsVisible}
        menuOpen={menuOpen}
        isPlaying={playing}
        page={page}
      />
    </div>
  );
}