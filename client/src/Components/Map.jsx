import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";

function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}

const Map = () => {
  var map, marker;
  const [flag, setFlag] = useState(false);
  const [fg, setFg] = useState({});
  const [isDataUpdated, updateData] = useState(0);
  const [future, setFuture] = useState({
    Latitude: toFixed(40.4212216, 5),
    Longitude: toFixed(-3.6286935, 5)
  });
  useEffect(() => {
    window.L.mapquest.key = "6kGGFBuABs2Z9TqeYxq7GTxpgA3N9Qeg";
    const newFg = window.L.featureGroup();
    setFg(newFg);

    map = window.L.mapquest.map("map", {
      center: [toFixed(40.4212216, 5), toFixed(-3.6286935, 5)],
      layers: [window.L.mapquest.tileLayer("dark"), newFg],
      zoom: 15
    });

    window.L.marker(
      [toFixed(future.Latitude, 5), toFixed(future.Longitude, 5)],
      {
        icon: window.L.mapquest.icons.marker({
          primaryColor: "#101820",
          secondaryColor: "#417505",
          shadow: true,
          size: "md"
        })
      }
    ).addTo(newFg);
  }, []);
  const handleClickAdd = () => {
    window.L.marker(
      [toFixed(future.Latitude, 5), toFixed(future.Longitude, 5)],
      {
        icon: window.L.mapquest.icons.marker({
          primaryColor: "#22407F",
          secondaryColor: "#3B5998",
          shadow: true,
          size: "md"
        })
      }
    ).addTo(fg);
  };

  const handleApiCall = () => {
    fetch("http://localhost:5000/getLocation")
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        setFuture(data);
        console.log(data.Latitude, typeof data.Latitude);
        window.L.marker(
          [toFixed(data.Latitude, 5), toFixed(data.Longitude, 5)],
          {
            icon: window.L.mapquest.icons.marker({
              primaryColor: "#101820",
              secondaryColor: "#800000",
              shadow: true,
              size: "md"
            })
          }
        ).addTo(fg);
        updateData(isDataUpdated + 1);
      });
  };

  const handleClickRemove = () => {
    if (fg.getLayers().length > 0) fg.removeLayer(fg.getLayers()[0]);
  };

  const handleClick = () => {
    if (flag) {
      if (fg.getLayers().length > 0) fg.removeLayer(fg.getLayers()[0]);
    } else {
      window.L.marker([17.45426, 78.43815], {
        icon: window.L.mapquest.icons.marker({
          primaryColor: "#22407F",
          secondaryColor: "#3B5998",
          shadow: true,
          size: "md",
          symbol: "A"
        })
      }).addTo(fg);
    }
    setFlag(!flag);
    setFg(fg);
  };
  return (
    <>
      <Button onClick={() => handleClickAdd()}>Add Marker</Button>
      <Button onClick={() => handleClickRemove()}>Remove Marker</Button>
      <Button onClick={() => handleClick()}>Toggle Marker</Button>
      <Button onClick={() => handleApiCall()}>Make API Call</Button>
    </>
  );
};

export default Map;
