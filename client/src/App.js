import React from "react";
import Map from "./Components/Map.jsx";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <>
      <div id="map" style={({ width: 10 }, { height: 800 })}></div>
      <div>
        <Map />
      </div>
    </>
  );
}

export default App;
