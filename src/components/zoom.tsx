'use client'
import {useState, useEffect, useRef} from 'react'
import './zoom.css';

type ZoomProps = {
    children?: React.ReactNode, // The content to be displayed inside the Zoom component
    entireImage:string, // URL or path to the image wiuthout transparency
    holeImage:string, // URL or path to the image with transparency
    maxZoomValue?:number |undefined;
}

export default function Zoom({children, entireImage, holeImage, maxZoomValue = 1500}: ZoomProps) {
    const [zoomState, setZoomState] = useState({
        /* sectionNumber: undefined, */
         /* scrollDirection: "down", */
        scrollPosition: 0,
        vh: window.innerHeight
    })

    /*as it is configured you can conly choose a total of 8 sections*/
    const sectionsCofee: number = 5; //The value of the scroll distance until disappering in sections of 100vh each /*TODO: check name and make the value dynamic */
    const sectionsContent: number = 8;/*TODO: check name and make the value dynamic */

    /*Adjustments */
    const startZoom = useRef<number | undefined>(undefined);
    
    const maxZoom : number = maxZoomValue;
    const vh: number = window.innerHeight;
    
    /*Variables*/
    let sectionNumber : number | undefined = startZoom.current;
    let zoomedImagePath : number | undefined = sectionsCofee*(vh/2); //the total path of the zoomed image until disappering in pixels
    const intervalZoom = useRef<number | undefined>(undefined);
    const zoomContainerPosition = useRef<number>(0);

    /* Track window scroll position */
    useEffect(() => {
      // Adding the images to the backgound of the divs dynamically for the Zoom effect
      let holeImageDiv = document.getElementById("holeImage") as HTMLElement;
      let entireImageDiv = document.getElementById("entireImage") as HTMLElement;
      holeImageDiv.style.backgroundImage = `url(${holeImage})`;
      entireImageDiv.style.backgroundImage = `url(${entireImage})`;

        const handleScroll = () => {
            const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
            /* const direction = y > 0 ? "down" : "up"; */ //TODO: check the function of direction
            /* setZoomState(prev => ({ ...prev, scrollPosition: y, scrollDirection: direction })) */
            setZoomState(prev => ({ ...prev, scrollPosition: y}))
        }
        // initialize
        handleScroll()
        //event listeners
        window.addEventListener('scroll', handleScroll, { passive: true })

        //other functions
        /* chagne name to coffeePath */


        let zoomContainer : HTMLElement = document.getElementById("zoomContainer") as HTMLElement; 
        zoomContainerPosition.current = zoomContainer.getBoundingClientRect().y+window.scrollY;



        let p : Promise<number> = new Promise<number>((resolve, reject) => {
          getStartZoom(resolve)
        })
        p.then((percentage) => {
          startZoom.current = percentage;
          intervalZoom.current = maxZoom - (startZoom.current || 0);
        })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(()=>{
        cofeeAnimation();
        /* sectionsTrigger(zoomState.scrollPosition); */
    })

    // getStartZoom calculates the initial zoom percentage of the zoomed image based on its dimensions and the container size
    const getStartZoom = (resolve: (value: number) => void) => {
      let div : HTMLElement = document.getElementsByClassName("entireImage")[0] as HTMLElement;
      let style : CSSStyleDeclaration = window.getComputedStyle(div);
      let bg : string = style.backgroundImage.slice(5, -2);
      
      let background : HTMLImageElement = new Image();
      background.src = bg;
      background.onload = calculateRatio;
      
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

    ///////////////////////////////////////////////////////Aquí me quedé

    const sectionsTrigger = (scrollPosition : number)=>{
      sectionNumber= calculateSection(scrollPosition);
    }

    const calculateSection = (scrollPosition:number)=>{
      let actualSection = (Math.floor((scrollPosition-(zoomContainerPosition.current || 0))/(vh/2))); // look after (coffePosition || 0) could be wrong
      let startSection = sectionsCofee-1;
      let validatedSection = ((actualSection-startSection)>-1 && (actualSection-startSection)<sectionsContent+1)?actualSection-startSection:undefined;
      return validatedSection;
    }

    const calculateScrollPercentage = ()=>{
      return ((zoomState.scrollPosition-(zoomContainerPosition.current || 0))*100)/((zoomedImagePath || 0)-(vh/2)); // look after (coffePosition || 0) and (cofeePath || 0) could be wrong
    }

    const cofeeAnimation = ()=>{
      /* calculating the container size in procent*/
      let scrollPercentage : number = calculateScrollPercentage();
      let newZoom : number | undefined = calculateZoom(scrollPercentage);
      let newOpacity=(100-scrollPercentage)+"%";

      if(sectionNumber===undefined){
        newZoom = startZoom.current;
        newOpacity = "100%";
      }
      updateCoffeeAnimation(newZoom,newOpacity);
    }

    const updateCoffeeAnimation = (newZoom:number | undefined,newOpacity:string)=>{
      let entireImage = document.getElementsByClassName("entireImage")[0] as HTMLElement;
      let holeImage = document.getElementsByClassName("holeImage")[0] as HTMLElement;

      /* Updating Zoom*/
      holeImage.style.backgroundSize=newZoom+"%";
      entireImage.style.backgroundSize=newZoom+"%";      

      /* Updating Opacity*/
      entireImage.style.opacity=newOpacity;
    }

    const calculateZoom = (scrollPercentage : number)=>{
      let newZoom = (((intervalZoom.current || 0)*scrollPercentage)/100) + (startZoom.current || 0); // check out  and (intervalZoom.current || 0) could be wrong
      if(newZoom <= (startZoom.current || 0)){newZoom = startZoom.current || 0}; // check out (startZoom.current || 0) could be wrong
      return newZoom;
    }


  return (
    <div id="zoomContainer" className="zoomContainer">
        <div className="zoomContent">
            {children}{zoomState.scrollPosition}
            <div className="zoomImages">
              <div id="holeImage" className="holeImage">
              </div>
              <div id="entireImage" className="entireImage">
              </div>
          </div>
        </div>
    </div>
  )
}
