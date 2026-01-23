import { ScrollProvider } from '../src/contexts/scrollContext';
import {ForegroundScrollHijack, Zoom, BackgroundScrollHijack} from '../src/components/index';

function App() {
  return (
    <>
      <Spacer/>
        <BackgroundScrollHijack >
          <div className="backgroundHijackBackgroundExample"> Background Scroll Hijack Content Example </div>
          <div className="backgroundHijackForegroundExample">
            <div className="backgroundHijackForegroundExampleInnerContainer">
              Foreground Scroll Hijack Content Example 
            </div>
          </div>
        </BackgroundScrollHijack>
      {/* <Spacer/>
        <ForegroundScrollHijack scrollPath="300vh" >
          <div className="foregroundHijackContentExample"> Foreground Scroll Hijack Content Example </div>
        </ForegroundScrollHijack>
      <Spacer/>
        <ScrollProvider>
          <Zoom entireImage={"./CoffeeEntire.png"} maskImage={"./CoffeeMask.png"} totalPath="200vh" magnificationPath="100vh">
            <div className="zoomContentExample"> Zoom Content Example </div>
          </Zoom>
        </ScrollProvider>
      <Spacer/> */}
        
      <Spacer/>
    </>
  )
}

function Spacer(){
  return (<div className="contentContainer"> Space for scrolling </div>);
}

export default App