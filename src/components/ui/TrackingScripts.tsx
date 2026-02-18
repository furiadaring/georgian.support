"use client";

import { useEffect } from "react";

const TRACKERS = [
  {
    id: "95a7120e-9386-f816-0ece-b8a15392df16",
    url: "https://track.georgian.support/KXGB3w?",
  },
  {
    id: "0ba14e2f-f9da-4c81-4842-88da24f3af00",
    url: "https://redirgo.link/H4ZTcH?",
  },
];

export default function TrackingScripts() {
  useEffect(() => {
    TRACKERS.forEach(({ id, url }) => {
      const el = document.getElementById(id);
      if (el) {
        const referrer = encodeURIComponent(document.referrer);
        const keyword = encodeURIComponent(document.title);
        const search = window.location.search.replace("?", "&");
        el.innerHTML = `<a href="${url}&se_referrer=${referrer}&default_keyword=${keyword}&${search}">Link</a>`;
      }
    });
  }, []);

  return (
    <>
      {TRACKERS.map(({ id }) => (
        <span key={id} id={id} style={{ display: "none" }} />
      ))}
    </>
  );
}
