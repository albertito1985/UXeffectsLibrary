import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import type {ReactNode } from 'react';

// ----- Types -----

interface ScrollProviderProps {
  children: ReactNode;
}

// ----- Context -----

const ScrollContext = createContext<number>(0);

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
  const [pos, setPos] = useState<number>(0);

  useEffect(() => {
    const onScroll = () => {
      setPos(() => {
        const newPos = window.scrollY;
        return newPos;
      });
    };

    const throttled = throttle(onScroll, 10);

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

export const useScroll = (): number => {
  return useContext(ScrollContext);
};
