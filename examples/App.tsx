import Zoom from '../src/components/zoom';

function App() {
  return (
    <>
    <div className="contentContainer"> Only to make space for scrolling </div>
      <Zoom entireImage={"./CoffeeEntire.png"} holeImage={"./CoffeeHole.png"}>
        <div className="zoomContent"> Zoom content example </div>
      </Zoom>
    </>
  )
}

export default App