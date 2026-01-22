import { ScrollProvider } from '../src/components/scrollContext';
import ScrollHijack from '../src/components/scrollHijack';
import Zoom from '../src/components/zoom';

function App() {
  return (
    <>
    <div className="bodyContainer">
      <div className="contentContainer"> Space for scrolling </div>
        <ScrollHijack scrollPath="300vh" >
          <div className="hijackContentExample"> Scroll Hijack Content Example </div>
        </ScrollHijack>
        <ScrollProvider>
          <Zoom entireImage={"./CoffeeEntire.png"} maskImage={"./CoffeeMask.png"} totalPath="200vh" magnificationPath="100vh">
            <div className="zoomContentExample"> Zoom Content Example </div>
          </Zoom>
        </ScrollProvider>
      <div className="contentContainer"> Space for scrolling </div>
    </div>
    
    </>
  )
}

export default App