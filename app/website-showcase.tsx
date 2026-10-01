"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from 'react';
import './website-showcase.css';

const concepts = [
  { name: 'garden', image: '/website-concepts/gruenraum.webp' },
  { name: 'hotel', image: '/website-concepts/aurel.webp' },
  { name: 'architecture', image: '/website-concepts/studio-nord.webp' },
];

export function WebsiteShowcase() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    let active = true;
    element.dataset.motion = 'waiting';
    const images = Promise.allSettled(
      Array.from(element.querySelectorAll('img'), image => image.decode()),
    );
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void images.then(() => {
        if (active) element.dataset.motion = 'enter';
      });
    }, { threshold: 0.15 });
    observer.observe(element);

    return () => {
      active = false;
      observer.disconnect();
      delete element.dataset.motion;
    };
  }, []);

  return (
    <div
      ref={root}
      className="website-showcase"
      role="img"
      aria-label="Drei fiktive Website-Designkonzepte: Gartenstudio, Boutiquehotel und Architektur."
    >
      <div className="website-stack" aria-hidden="true">
        {concepts.map(concept => (
          <div key={concept.name} className={`website-preview website-preview-${concept.name}`}>
            <img
              src={concept.image}
              width="1122"
              height="1402"
              alt=""
              decoding="async"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
