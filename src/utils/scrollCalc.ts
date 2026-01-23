export const calculateScrollPercentage = (scrollPosition: number, hijackContainerPosition: number, zoomScrollPath: number)=>{
      let percentage = ((scrollPosition-hijackContainerPosition)*100)/zoomScrollPath;
      return percentage;
    }