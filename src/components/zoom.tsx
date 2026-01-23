'use client'
import {useEffect, useRef} from 'react'
import '../../styles/zoom.css';
import ScrollHijack from './scrollHijack';
import { evaluateCalc } from '../utils/index';
import { useScroll } from '../contexts/scrollContext';
import useResizeObserver from '../hooks/useResizeObserver';
import { calculateScrollPercentage, calculateContainerPosition, getStartZoom } from '../utils/index';

let instanceCounter = 0;

type ZoomProps = {
    children?: React.ReactNode;
    entireImage:string, // URL or path to the image wiuthout transparency
    maskImage?:string, // URL or path to the image with transparency
    magnification?:number; // Magnification factor for the zoom effect
    magnificationPath?:string; // the scroll distance over which the zoom effect occurs
    totalPath?:string; // height of the scroll hijack container
}

export default function Zoom({children, entireImage, maskImage, magnification = 20, magnificationPath = "50vh", totalPath}: ZoomProps) {
    const componentId = useRef<string>(`zoom-instance-${++instanceCounter}`).current;

    const scrollPosition : number = useScroll();
    /* Configuration */
    const startZoom = useRef<number | undefined>(undefined);
    const maxZoom = useRef<number | undefined>(undefined);

    /* Variables */
    const intervalZoom = useRef<number | undefined>(undefined);
    const hijackContainerPosition = useRef<number>(0);
    const zoomScrollPath = useRef<number | undefined>(undefined); // The scroll distance over which the zoom effect occurs

    /* Resize Observer */
    const { observe, unobserve } = useResizeObserver(() => {
        setContainerPositionAndMagnificationPath(); // Recalculate the position and scroll path on resize
        zoomAnimation(); // Reapply zoom animation on resize
    });

    /* Initialize setup */
    useEffect(() => {
      const hijackContainer = document.getElementsByClassName(componentId)[0] as HTMLElement;
      observe(hijackContainer); // Start observing the container
      Setup();

      return () => {
        unobserve(); // Cleanup observer on unmount
      };
    }, []);

    useEffect(() => {
      zoomAnimation();
    }, [scrollPosition]);

    const Setup = () : void => {
      // Adding the images to the background of the divs dynamically for the Zoom effect
      loadImages();

      // Declaring the position of the container and the magnificationPath for the zoom effect
      setContainerPositionAndMagnificationPath();
      
      let p = new Promise<number>((resolve) => {
        // getStartZoom calculates the initial zoom percentage of the zoomed image based on its dimensions and the container size
        let div : HTMLElement = document.getElementById(`entireImage-${componentId}`) as HTMLElement;
        getStartZoom(div, resolve)
      })
      p.then((percentage) => {
        startZoom.current = percentage;
        maxZoom.current = percentage * magnification;
        intervalZoom.current = maxZoom.current - (startZoom.current);
        zoomAnimation();
      });

    }

    const loadImages = ()=>{
      let maskImageDiv = document.getElementById(`maskImage-${componentId}`) as HTMLElement;
      let entireImageDiv = document.getElementById(`entireImage-${componentId}`) as HTMLElement;
      maskImageDiv.style.backgroundImage = `url(${maskImage})`;
      entireImageDiv.style.backgroundImage = `url(${entireImage})`;
    }

    const setContainerPositionAndMagnificationPath = ()=>{

      let hijackContainer : HTMLElement = document.getElementsByClassName(componentId)[0] as HTMLElement;
      hijackContainerPosition.current = calculateContainerPosition(hijackContainer);

      let container : HTMLElement = document.getElementById(`zoomImages-${componentId}`) as HTMLElement;
      let scrollPathInPixels :string | undefined = evaluateCalc(magnificationPath,{
            parentWidth: container.parentElement?.clientWidth,
            parentHeight: container.parentElement?.clientHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        }) || undefined;
      zoomScrollPath.current = parseInt(scrollPathInPixels?.slice(0, -2) || "0"); // The scroll distance over which the zoom effect occurs
    }

    // Track scroll position
    const zoomAnimation = () => {
        let scrollPercentage : number = calculateScrollPercentage(scrollPosition, hijackContainerPosition.current, zoomScrollPath.current!);
        let newZoom : number | undefined = calculateZoom(scrollPercentage);
        let opacityValue = Math.max(0, Math.min(100, 100 - scrollPercentage));
        let newOpacity = opacityValue + "%";
        updateZoomAnimation(newZoom, newOpacity);
    };

    const updateZoomAnimation = (newZoom:number | undefined,newOpacity:string)=>{
      let entireImage = document.getElementById(`entireImage-${componentId}`) as HTMLElement;
      let maskImage = document.getElementById(`maskImage-${componentId}`) as HTMLElement;

      /* Updating Zoom*/
      maskImage.style.backgroundSize=newZoom+"%";
      entireImage.style.backgroundSize=newZoom+"%";      

      /* Updating Opacity*/
      entireImage.style.opacity=newOpacity;
    }

    const calculateZoom = (scrollPercentage : number)=>{
      let newZoom = (((maxZoom.current || 0) * scrollPercentage)/100);
      if(newZoom <= (startZoom.current || 0)){newZoom = startZoom.current || 0};
      if(newZoom >= (maxZoom.current || 0)) {newZoom = maxZoom.current || 0};
      return newZoom;
    }

  return (
          <ScrollHijack className={componentId} scrollPath={totalPath} >
              <div id={`zoomImages-${componentId}`} className="zoomImages">
                <div id={`maskImage-${componentId}`} className="maskImage">
                </div>
                <div id={`entireImage-${componentId}`} className="entireImage">
                </div>
              </div>
              {children}
          </ScrollHijack>
    )
}
