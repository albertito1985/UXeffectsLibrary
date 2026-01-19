import ScrollHijack from '../src/components/scrollHijack';
import Zoom from '../src/components/zoom';

function App() {
  return (
    <>
    
    <div className="contentContainer"> Space for scrolling </div>
      <ScrollHijack scrollPath="300vh" >
          <div className="hijackContentExample"> Scroll Hijack Content Example </div>
      </ScrollHijack>
      <Zoom entireImage={"./CoffeeEntire.png"} maskImage={"./CoffeeMask.png"} totalPath="500vh" magnificationPath="100vh"/>
    <div className="contentContainer"> Space for scrolling </div>
    </>
  )
}

export default App