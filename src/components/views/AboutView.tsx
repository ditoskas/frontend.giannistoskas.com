import React, { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

interface AboutData {
  "about.h1": string;
  "about.p1": string;
  "about.p2": string;
  "about.p3": string;
  "about.title": string;
}

// Memory cache for about data
let cachedAboutData: AboutData | null = null;

const AboutView: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(cachedAboutData);
  const [loading, setLoading] = useState(!cachedAboutData);

  useEffect(() => {
    // If we have data, we don't need to fetch
    if (cachedAboutData) {
      setData(cachedAboutData);
      setLoading(false);
      return;
    }

    setLoading(true);

    apiClient.get("/dynamic-section/about")
      .then(({ data: resp }) => {
        if (resp && resp.data) {
          cachedAboutData = resp.data;
          setData(resp.data);
        }
      })
      .catch((err) => {
        console.error("AboutView fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading && !data) {
    return (
      <div className="h-full w-full flex items-center justify-start p-10">
        <div className="text-primary text-[16px] opacity-50 uppercase tracking-widest">
          Loading About Content...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full w-full flex items-center justify-start p-10">
        <div className="text-primary text-[16px] opacity-50 uppercase tracking-widest">
          Content unavailable.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-start overflow-y-auto p-10">
      <div className="max-w-[600px]">
        <h1 className="text-primary text-[24px] tracking-[0.15em] mb-6 uppercase">
          {data["about.h1"]}
        </h1>
        <h2 className="text-primary text-[22px] font-normal mb-6">
          {data["about.title"]}
        </h2>
        <div className="text-content">
          <p className="mb-5 whitespace-pre-line text-primary/80">{data["about.p1"]}</p>
          <p className="mb-5 whitespace-pre-line text-primary/80">{data["about.p2"]}</p>
          <p className="whitespace-pre-line text-primary/80">{data["about.p3"]}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutView;