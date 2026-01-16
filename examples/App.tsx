import Zoom from '../src/components/zoom';

function App() {
  return (
    <>
    <div className="contentContainer"> Space for scrolling </div>
      <Zoom entireImage={"./CoffeeEntire.png"} maskImage={"./CoffeeHole.png"}>
        <div className="zoomContent"> Zoom content example </div>
      </Zoom>
    <div className="contentContainer"> Space for scrolling </div>
    </>
  )
}

export default App