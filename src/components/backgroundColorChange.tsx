import { useEffect, useRef } from 'react';
import '../styles/backrgoundColorChange.css';
import { BackgroundScrollHijack } from './backgroundScrollHijack';

let instanceCounter = 0;

type BackgroundColorChangeProps = {
    children?: React.ReactNode;
    scrollPath?: string;
};

export function BackgroundColorChange({ children, scrollPath = "150vh"}: BackgroundColorChangeProps) {
    const backgroundColorChangeId = useRef<string>(`background-colorChange-instance-${++instanceCounter}`).current;

    useEffect(() => {
        Setup();
    }, []);

      const Setup = (): void => {
        const vh: number = window.innerHeight;
        const vw: number = window.innerWidth;

        // Setting the size of the circle to cover the entire viewport diagonally
        const circleDiameter = Math.sqrt((vh ** 2) + (vw ** 2));
        const circleElement = document.getElementById(`${backgroundColorChangeId}-circle`) as HTMLElement;
        circleElement.style.width = circleDiameter + "px";
        circleElement.style.height = circleDiameter + "px";

        // Setting the size of the container to allow the circle to be fully invisible at the start
        const containerElement = document.getElementById(`${backgroundColorChangeId}-container`) as HTMLElement;
        containerElement.style.height = circleDiameter*2 + "px";
        containerElement.style.width = circleDiameter*2 + "px";

        //Positioning the circle hidden on the bottom right corner of the viewport
        circleElement.style.bottom = `${(circleDiameter-vh)/2}px`;
        circleElement.style.right = `${(circleDiameter-vw)/2}px`;

      };

    return (
        <BackgroundScrollHijack scrollPath={scrollPath} className={`backgroundColorChange ${backgroundColorChangeId}`}>
            <div className="backgroundColorChangeContent">
              <div id={`${backgroundColorChangeId}-container`} className="backgroundColorChangeCircleContainer blue">
                <div id={`${backgroundColorChangeId}-circle`} className="backgroundColorChangeCircle">
                </div>
              </div>
            </div>
            {children && children}
        </BackgroundScrollHijack>
    );
}
