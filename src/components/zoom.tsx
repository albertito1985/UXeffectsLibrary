'use client'
import {useEffect, useRef} from 'react'
import './zoom.css';
import ScrollHijack from './scrollHijack';
import { evaluateCalc } from '../utils/cssCalc';

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
    
    const scrollPosition = useRef<number>(0);
    /* Configuration */
    const startZoom = useRef<number | undefined>(undefined);
    const maxZoom = useRef<number | undefined>(undefined);

    /* Variables */
    const intervalZoom = useRef<number | undefined>(undefined);
    const hijackContainerPosition = useRef<number>(0);
    const zoomScrollPath = useRef<number | undefined>(undefined); // The scroll distance over which the zoom effect occurs

    /* Track window scroll position */
    useEffect(() => {
      // Adding the images to the background of the divs dynamically for the Zoom effect
      let maskImageDiv = document.getElementById(`maskImage-${componentId}`) as HTMLElement;
      let entireImageDiv = document.getElementById(`entireImage-${componentId}`) as HTMLElement;
      maskImageDiv.style.backgroundImage = `url(${maskImage})`;
      entireImageDiv.style.backgroundImage = `url(${entireImage})`;

      let hijackContainer : HTMLElement = document.getElementsByClassName(componentId)[0] as HTMLElement;
      hijackContainerPosition.current = hijackContainer.getBoundingClientRect().y+window.scrollY;

      let container : HTMLElement = document.getElementById(`zoomImages-${componentId}`) as HTMLElement;
      let scrollPathInPixels :string | undefined = evaluateCalc(magnificationPath,{
            parentWidth: container.parentElement?.clientWidth,
            parentHeight: container.parentElement?.clientHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        }) || undefined;
      zoomScrollPath.current = parseInt(scrollPathInPixels?.slice(0, -2) || "0"); // The scroll distance over which the zoom effect occurs
      
      let p = new Promise<number>((resolve) => {
        getStartZoom(resolve)
      })
      p.then((percentage) => {
        startZoom.current = percentage;
        maxZoom.current = percentage * magnification;
        intervalZoom.current = maxZoom.current - (startZoom.current);
        zoomAnimation();
      });

      // Track scroll position
      const handleScroll = () => {
        const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        scrollPosition.current = y;
        zoomAnimation();
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [])

    // getStartZoom calculates the initial zoom percentage of the zoomed image based on its dimensions and the container size
    const getStartZoom = async (resolve: (value: number) => void) => {
      let div : HTMLElement = document.getElementById(`entireImage-${componentId}`) as HTMLElement;
      let style : CSSStyleDeclaration = window.getComputedStyle(div);
      let bg : string = style.backgroundImage.slice(5, -2);
      
      let background : HTMLImageElement = new Image();
      background.src = bg;
      background.onload = await calculateRatio;
      
        function calculateRatio(){
          let percentage : number | undefined = undefined;
          
          if (background.width > background.height) {
              let ratio : number = background.height / background.width;
              if (div.offsetWidth > div.offsetHeight) {
                  let bgW : number = div.offsetWidth;
                  percentage = 100;
                  let bgH : number = Math.round(div.offsetWidth * ratio);
                  if (bgH < div.offsetHeight) {
                      bgH = div.offsetHeight;
                      bgW = Math.round(bgH / ratio);
                      percentage=(100*bgW)/div.offsetWidth;
                  }
              } else {
                  var bgW = Math.round(div.offsetHeight / ratio);
                  percentage=(100*bgW)/div.offsetWidth;
                  bgH = div.offsetHeight;
              }
          } else {
              var ratio = background.width / background.height;
              if (div.offsetHeight > div.offsetWidth) {
                  var bgH = div.offsetHeight;
                  percentage=100;
                  var bgW = Math.round(div.offsetHeight * ratio);
                  if (bgW > div.offsetWidth) {
                      bgW = div.offsetWidth;
                      bgH = Math.round(bgW / ratio);
                      percentage=(100*bgH)/div.offsetHeight;
                  }
              } else {
                  var bgW = Math.round(div.offsetWidth / ratio);
                  var bgH = div.offsetWidth;
                  percentage=100;
              }
          }
          resolve(percentage)
      }
    }

    const calculateScrollPercentage = ()=>{
      let percentage = ((scrollPosition.current-hijackContainerPosition.current)*100)/zoomScrollPath.current!;
      return percentage;
    }

    const zoomAnimation = ()=>{
      let scrollPercentage : number = calculateScrollPercentage();
      let newZoom : number | undefined = calculateZoom(scrollPercentage);
      let opacityValue = Math.max(0, Math.min(100, 100 - scrollPercentage));
      let newOpacity = opacityValue + "%";
      updateZoomAnimation(newZoom,newOpacity);
    }

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
