'use client'
import {useState, useEffect, useRef} from 'react'
import './zoom.css';

type ZoomProps = {
    children?: React.ReactNode, // The content to be displayed inside the Zoom component
    entireImage:string, // URL or path to the image wiuthout transparency
    holeImage:string, // URL or path to the image with transparency
    maxZoom?:number |undefined;
    zoomScrollPath?:number;
}

export default function Zoom({children, entireImage, holeImage, maxZoom = 1500, zoomScrollPath = 1000}: ZoomProps) {
    const [zoomState, setZoomState] = useState({
        scrollPosition: 0
    })

    /*Adjustments */
    const startZoom = useRef<number | undefined>(undefined);
    
    /*Variables*/
    let sectionNumber : number | undefined = startZoom.current;
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
          setZoomState(prev => ({ ...prev, scrollPosition: y}))
        }
        // initialize
        handleScroll()
        //event listeners
        window.addEventListener('scroll', handleScroll, { passive: true })

        //other functions
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

    const calculateScrollPercentage = ()=>{
      return ((zoomState.scrollPosition-zoomContainerPosition.current)*100)/(zoomScrollPath); // look after (coffePosition || 0) and (cofeePath || 0) could be wrong
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
