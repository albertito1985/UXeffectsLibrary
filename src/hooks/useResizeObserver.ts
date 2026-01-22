import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that uses the ResizeObserver API to observe size changes of a target element.
 *
 * @param callback - Function to execute when the observed element's size changes.
 * @returns A ref to attach to the element to be observed.
 */
function useResizeObserver(callback: (entry: ResizeObserverEntry) => void) {
  const observerRef = useRef<ResizeObserver | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const [isObserving, setIsObserving] = useState(false);

  useEffect(() => {
    if (!callback || typeof callback !== 'function') {
      console.error('Callback must be a function');
      return;
    }

    observerRef.current = new ResizeObserver((entries) => {
      entries.forEach((entry) => callback(entry));
    });

    return () => {
      // Cleanup observer on unmount
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [callback]);

  const observe = (element: HTMLElement | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
      targetRef.current = element;
      setIsObserving(true);
    }
  };

  const unobserve = () => {
    if (targetRef.current && observerRef.current) {
      observerRef.current.unobserve(targetRef.current);
      setIsObserving(false);
    }
  };

  return { observe, unobserve, isObserving };
}

export default useResizeObserver;