import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import type {ReactNode } from 'react';

// ----- Types -----

interface ScrollContextValue {
  y: number;
}

interface ScrollProviderProps {
  children: ReactNode;
}

// ----- Context -----

const ScrollContext = createContext<ScrollContextValue>({
  y: 0
});

// ----- Simple throttle helper -----

function throttle<T extends (...args: any[]) => void>(
  fn: T,
  wait: number
): T {
  let last = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  } as T;
}

// ----- Provider -----

export const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
}) => {
  const [pos, setPos] = useState<ScrollContextValue>({
    y: 0
  });

  useEffect(() => {
    const onScroll = () => {
      setPos({
        y: window.scrollY
      });
    };

    const throttled = throttle(onScroll, 50);

    window.addEventListener("scroll", throttled, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttled);
    };
  }, []);

  return (
    <ScrollContext.Provider value={pos}>
      {children}
    </ScrollContext.Provider>
  );
};

// ----- Hook -----

export const useScroll = (): ScrollContextValue => {
  return useContext(ScrollContext);
};
