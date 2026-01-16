'use client'
import {useEffect} from 'react'
import './scrollHijack.css';

type ScrollHijackProps = {
    children?: React.ReactNode;
    height?: string;
}

export default function ScrollHijack({ children, height = "calc(100vh + 500px)" }: ScrollHijackProps) {
    useEffect(() => {
        let hijackContainer = document.getElementById("hijackContainer") as HTMLElement;
        hijackContainer.style.height = height;
    });

    return (
                <div id="hijackContainer" className="hijackContainer">
                    <div id="hijackContent" className="hijackContent">
                        {children}
                    </div>
                </div>
    );
}
