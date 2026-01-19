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
    const scrollHijackContentId = useRef<string>(`scrollHijack-instance-${++instanceCounter}-content`).current;

    useEffect(() => {
        let container : HTMLElement = document.getElementById(scrollHijackContainerId) as HTMLElement;
        let vh100 : number = window.innerHeight;
        let hijackContent = document.getElementById(scrollHijackContentId) as HTMLElement;
        let childrenHeight : number = hijackContent.scrollHeight;
        
        // changing the incomming scrollPath value to pixels if needed
        const incommingScrollPath : string = evaluateCalc(scrollPath, {
            parentWidth: container.parentElement?.clientWidth,
            parentHeight: container.parentElement?.clientHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: vh100
        });

        // Ensure scrollPath is at least as tall as the hijack content + 50vh
        if(parseInt(incommingScrollPath.slice(0, -2)) < childrenHeight + (vh100/2)){
            scrollPath = childrenHeight + (vh100/2) + "px";
        };

        container.style.height = scrollPath;
        hijackContent.style.height = childrenHeight + "px";

    }, []);

    return (
            <div id={scrollHijackContainerId} className={`hijackContainer ${className ? className : ""}`}>
                <div id={scrollHijackContentId} className="hijackContent">
                    {children}
                </div>
            </div>
    );
}
