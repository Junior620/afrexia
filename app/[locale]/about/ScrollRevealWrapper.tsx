'use client';

import { useEffect, ReactNode } from 'react';

interface ScrollRevealWrapperProps {
  children: ReactNode;
}

export function ScrollRevealWrapper({ children }: ScrollRevealWrapperProps) {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx global>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
        }
        
        .scroll-reveal.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {children}
    </>
  );
}
