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

    const zoomContainerId = useRef<string>(`scrollHijack-instance-${++instanceCounter}`).current;
    const zoomContentId = useRef<string>(`scrollHijack-instance-${++instanceCounter}-content`).current;

    useEffect(() => {
        let container : HTMLElement = document.getElementById(zoomContainerId) as HTMLElement;
        /* let childrenContainer : HTMLElement = (document.getElementById(zoomContentId) as HTMLElement).firstChild as HTMLElement; */
        let parentHeight : number = container.parentElement?.clientHeight || 0;
        let vh100 : number = window.innerHeight;
        
        // Ensure hijack content is at least 100vh tall
        
        let hijackContent = document.getElementById(zoomContentId) as HTMLElement;
        console.log(hijackContent);
        console.log(hijackContent.scrollHeight);


        let childrenHeight : number = hijackContent.scrollHeight;

        let newChildrenHeight : number = (childrenHeight < vh100 )? vh100 : childrenHeight;
        
        // changing the incomming scrollPath value to pixels if needed
        const incommingScrollPath : string = evaluateCalc(scrollPath, {
            parentWidth: container.parentElement?.clientWidth,
            parentHeight: parentHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: vh100
        });

        // Ensure scrollPath is at least as tall as the hijack content
        if(parseInt(incommingScrollPath.slice(0, -2)) < newChildrenHeight){
            scrollPath = newChildrenHeight + "px";
        };

        container.style.height = scrollPath;

        /* let hijackContent : HTMLElement = document.getElementById(zoomContentId) as HTMLElement; */
        hijackContent.style.height = newChildrenHeight! + "px";

    }, []);

    return (
            <div id={zoomContainerId} className={`hijackContainer ${className ? className : ""}`}>
                <div id={zoomContentId} className="hijackContent">
                    {children}
                </div>
            </div>
    );
}
