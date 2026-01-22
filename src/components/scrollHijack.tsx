'use client'
import {useEffect, useRef} from 'react'
import './scrollHijack.css';
import { evaluateCalc } from '../utils/cssCalc';
import useResizeObserver from '../hooks/useResizeObserver';

let instanceCounter = 0;

type ScrollHijackProps = {
    children: React.ReactNode;
    scrollPath?: string;
    className?: string;
}

export default function ScrollHijack({ children, scrollPath= "150vh", className }: ScrollHijackProps) {

    const scrollHijackContainerId = useRef<string>(`scrollHijack-instance-${++instanceCounter}`).current;
    const scrollHijackForegroundId = useRef<string>(`scrollHijack-instance-${++instanceCounter}-foreground`).current;
    const scrollHijackBackgroundId = useRef<string>(`scrollHijack-instance-${++instanceCounter}-background`).current;

    const childrenArray = Array.isArray(children) ? children : [children];
    const foreground = childrenArray.slice(0, 1);
    const background = childrenArray.slice(1);

    /* Resize Observer */
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

    const Setup = () : void => {
        let container : HTMLElement = document.getElementById(scrollHijackContainerId) as HTMLElement;
        let vh100 : number = window.innerHeight;
        let hijackBackground = document.getElementById(scrollHijackBackgroundId) as HTMLElement;
        let childrenHeight : number = hijackBackground.scrollHeight;
        
        // changing the incomming scrollPath value to pixels if needed
        const incommingScrollPath : string = evaluateCalc(scrollPath, {
            parentWidth: container.parentElement?.clientWidth,
            parentHeight: container.parentElement?.clientHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: vh100
        });

        let finalScrollPath = parseInt(incommingScrollPath.slice(0, -2));

        // Ensure scrollPath is at least as tall as the hijack content
        if(finalScrollPath < childrenHeight){
            finalScrollPath = childrenHeight;
        }

        // Check if background exists and is larger than scrollPath
        if(hijackBackground){
            let backgroundHeight = hijackBackground.scrollHeight;
            if(backgroundHeight > finalScrollPath){
                finalScrollPath = backgroundHeight;
            }
        }

        container.style.height = finalScrollPath + "px";
        hijackBackground.style.height = childrenHeight + "px";

    }

    return (
            <div id={scrollHijackContainerId} className={`hijackContainer ${className ? className : ""}`}>
                {background &&
                <div id={scrollHijackBackgroundId} className="hijackBackground">
                    {background}
                </div>}
                <div id={scrollHijackForegroundId} className="hijackForeground">
                    {foreground}
                </div>
            </div>
    );
}
