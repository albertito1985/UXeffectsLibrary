import { useEffect, useRef } from 'react';
import '../styles/backgroundScrollHijack.css';
import { evaluateCalc } from '../utils/cssCalc';
import useResizeObserver from '../hooks/useResizeObserver';

let instanceCounter = 0;

type BackgroundScrollHijackProps = {
    children: React.ReactNode;
    scrollPath?: string;
    className?: string;
};

export function BackgroundScrollHijack({ children, scrollPath = "150vh", className }: BackgroundScrollHijackProps) {
    ++instanceCounter;
    const scrollHijackContainerId = useRef<string>(`background-scrollHijack-instance-${instanceCounter}`).current;
    const scrollHijackForegroundId = useRef<string>(`background-scrollHijack-instance-${instanceCounter}-foreground`).current;
    const scrollHijackBackgroundId = useRef<string>(`background-scrollHijack-instance-${instanceCounter}-background`).current;

    const childrenArray = Array.isArray(children) ? children : [children];
    const foreground = childrenArray.slice(1);
    const background = childrenArray.slice(0, 1);

    const { observe, unobserve } = useResizeObserver(() => {
        Setup(); // Recalculate setup on resize
    });

    useEffect(() => {
        const container = document.getElementById(scrollHijackContainerId) as HTMLElement;
        observe(container); // Start observing the container
        Setup();

        return () => {
            unobserve(); // Cleanup observer on unmount
        };
    }, []);

    const Setup = (): void => {
        const container = document.getElementById(scrollHijackContainerId) as HTMLElement;
        const vh100 = window.innerHeight;

        // changing the incomming scrollPath value to pixels if needed
        const incommingScrollPath: string = evaluateCalc(scrollPath, {
            parentWidth: container.parentElement?.clientWidth,
            parentHeight: container.parentElement?.clientHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: vh100,
        });
        let finalScrollPath = parseInt(incommingScrollPath.slice(0, -2));

        // Ensure scrollPath is at least as tall as the foreground content
        if(foreground.length > 0){
          const foregroundContainer = document.getElementById(scrollHijackForegroundId) as HTMLElement;
          const contentHeight : number = foregroundContainer.scrollHeight;
          if (finalScrollPath < contentHeight) {
              finalScrollPath = contentHeight;
          }
        }

        container.style.height = finalScrollPath + "px";

        // make the background container as tall as the actual background
          const backgroundContainer = document.getElementById(scrollHijackBackgroundId) as HTMLElement;
          const backgroundHeight : number = backgroundContainer.scrollHeight;
          backgroundContainer.style.height = backgroundHeight + "px";
    };

    return (
        <div id={scrollHijackContainerId} className={`backgroundHijackContainer ${className ? className : ""}`}>
            <div id={scrollHijackBackgroundId} className="backgroundHijackBackground">
                {background}
            </div>
            {foreground &&
            <div id={scrollHijackForegroundId} className="backgroundHijackForeground">
                {foreground}
            </div>}
        </div>
    );
}
