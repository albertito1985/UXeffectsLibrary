
export const calculateScrollPercentage = (scrollPosition: number, hijackContainerPosition: number, zoomScrollPath: number)=>{
      let percentage = ((scrollPosition-hijackContainerPosition)*100)/zoomScrollPath;
      return percentage;
    }

export const calculateContainerPosition = (hijackContainer: HTMLElement)=>{
    return hijackContainer.getBoundingClientRect().y+window.scrollY;
}
