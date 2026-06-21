import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  // Inicia como visível: garante que conteúdo apareça em screenshots, bots e
  // qualquer ambiente onde IntersectionObserver não dispara (QA visual, pré-renderização).
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

export function useScrollRevealMultiple(count: number, options: UseScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  // Inicia todos como visíveis para garantir que conteúdo apareça em screenshots/bots
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(count).fill(true));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [count, threshold, rootMargin, triggerOnce]);

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  };

  return { setRef, visibleItems };
}
