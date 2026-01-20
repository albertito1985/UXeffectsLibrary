'use client'
import {useEffect, useRef} from 'react'
import './scrollHijack.css';
import { evaluateCalc } from '../utils/cssCalc';

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

    useEffect(() => {
        Setup();

        // Create ResizeObserver to watch for viewport changes
        const resizeObserver = new ResizeObserver(() => {
            Setup();
        });

        // Observe the document body for size changes
        resizeObserver.observe(document.body);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const Setup = () : void => {
        let container : HTMLElement = document.getElementById(scrollHijackContainerId) as HTMLElement;
        let vh100 : number = window.innerHeight;
        let hijackContent = document.getElementById(scrollHijackForegroundId) as HTMLElement;
        let childrenHeight : number = hijackContent.scrollHeight;
        
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
        let hijackBackground = document.getElementById(scrollHijackBackgroundId) as HTMLElement;
        if(hijackBackground){
            let backgroundHeight = hijackBackground.scrollHeight;
            if(backgroundHeight > finalScrollPath){
                finalScrollPath = backgroundHeight;
            }
        }

        container.style.height = finalScrollPath + "px";
        hijackContent.style.height = childrenHeight + "px";
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
