import React, {
  useEffect,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle
} from "react";
import { Button } from "semantic-ui-react";

function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}

const Map = forwardRef((props, ref) => {
  const [flag, setFlag] = useState(false);
  const [fg, setFg] = useState({});
  const [isDataUpdated, updateData] = useState(0);
  const [future, setFuture] = useState({
    Latitude: toFixed(40.4212216, 5),
    Longitude: toFixed(-3.6286935, 5)
  });
  const [shoppingCenters, setShoppingCenters] = useState({});
  useImperativeHandle(ref, () => ({
    handleApiCallWrapper() {
      handleApiCall();
    },
    findNearbyShoppingCentersWrapper() {
      findNearbyShoppingCenters();
    },
    findNearbyRestaurantsWrapper() {
      findNearbyRestaurants();
    },
    findNearbyHospitalsWrapper() {
      findNearbyHospitals();
    }
  }));
  useEffect(() => {
    window.L.mapquest.key = "6kGGFBuABs2Z9TqeYxq7GTxpgA3N9Qeg";
    const newFg = window.L.featureGroup();
    setFg(newFg);

    window.L.mapquest.map("map", {
      center: [toFixed(40.4212216, 5), toFixed(-3.6286935, 5)],
      layers: [window.L.mapquest.tileLayer("dark"), newFg],
      zoom: 15
    });

    window.L.marker([toFixed(40.4212216, 5), toFixed(-3.6286935, 5)], {
      icon: window.L.mapquest.icons.marker({
        primaryColor: "#101820",
        secondaryColor: "#417505",
        shadow: true,
        size: "md"
      })
    }).addTo(newFg);
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
        var directions = window.L.mapquest.directions();
        directions.route(
          {
            start: [toFixed(40.4212216, 5), toFixed(-3.6286935, 5)],
            end: [data.Latitude, data.Longitude]
          },
          addCustomLayer
        );
        function addCustomLayer(err, response) {
          var customLayer = window.L.mapquest.directionsLayer({
            startMarker: {
              icon: "marker",
              iconOptions: {
                size: "md",
                primaryColor: "#101820",
                secondaryColor: "#417505"
              },
              draggable: false,
              title: "You are here"
            },
            endMarker: {
              icon: "marker",
              iconOptions: {
                size: "md",
                primaryColor: "#101820",
                secondaryColor: "#800000"
              },
              title: "Possible destination"
            },
            routeRibbon: {
              color: "#2aa6ce",
              opacity: 1.0,
              showTraffic: false
            },
            directionsResponse: response
          });
          customLayer.addTo(fg);
        }
        updateData(isDataUpdated + 1);
      });
  };

  const findNearbyRestaurants = () => {
    const TomtomKEY = "2xrfCdFd2nGVXM5iYXAZpueDTqBfFYIh";
    fetch(
      `https://api.tomtom.com/search/2/poiSearch/restaurant.json?limit=5&lat=${future.Latitude}&lon=${future.Longitude}&radius=1000&categorySet=7315&key=${TomtomKEY}`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        for (var i in data.results) {
          console.log(
            data.results[i].position.lat,
            data.results[i].position.lon
          );
          window.L.marker(
            [
              toFixed(data.results[i].position.lat, 5),
              toFixed(data.results[i].position.lon, 5)
            ],
            {
              icon: window.L.mapquest.icons.marker({
                primaryColor: "#0e2433",
                secondaryColor: "#0e2433",
                shadow: true,
                size: "md",
                symbol: "R"
              }),
              title: data.results[i].poi.name
            }
          ).addTo(fg);
        }
      });
  };

  const findNearbyHospitals = () => {
    const TomtomKEY = "2xrfCdFd2nGVXM5iYXAZpueDTqBfFYIh";
    fetch(
      `https://api.tomtom.com/search/2/poiSearch/.json?limit=5&lat=${future.Latitude}&lon=${future.Longitude}&radius=10000&categorySet=7321&key=${TomtomKEY}`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        for (var i in data.results) {
          console.log(data.results);
          console.log(
            data.results[i].position.lat,
            data.results[i].position.lon
          );
          window.L.marker(
            [
              toFixed(data.results[i].position.lat, 5),
              toFixed(data.results[i].position.lon, 5)
            ],
            {
              icon: window.L.mapquest.icons.marker({
                primaryColor: "#ff0000",
                secondaryColor: "#ff0000",
                shadow: true,
                size: "md",
                symbol: "H"
              }),
              title: data.results[i].poi.name
            }
          ).addTo(fg);
        }
      });
  };

  const findNearbyShoppingCenters = () => {
    const TomtomKEY = "2xrfCdFd2nGVXM5iYXAZpueDTqBfFYIh";
    fetch(
      `https://api.tomtom.com/search/2/poiSearch/.json?limit=5&lat=${future.Latitude}&lon=${future.Longitude}&radius=10000&categorySet=7373&key=${TomtomKEY}`
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        for (var i in data.results) {
          console.log(data.results);
          console.log(
            data.results[i].position.lat,
            data.results[i].position.lon
          );
          // window.L.marker(
          //   [toFixed(data.results[i].position.lat, 5), toFixed(data.results[i].position.lon, 5)],
          //   {
          //     icon: window.L.mapquest.icons.marker({
          //       primaryColor: "#ffa500",
          //       secondaryColor: "#ffa500",
          //       shadow: true,
          //       size: "md",
          //       symbol: "S"
          //     }),
          //     title: data.results[i].poi.name
          //   },
          // ).addTo(fg);
          var directions = window.L.mapquest.directions();
          directions.route(
            {
              start: [toFixed(40.4212216, 5), toFixed(-3.6286935, 5)],
              end: [
                toFixed(data.results[i].position.lat, 5),
                toFixed(data.results[i].position.lon, 5)
              ]
            },
            addCustomLayer
          );
          function addCustomLayer(err, response) {
            var customLayer = window.L.mapquest.directionsLayer({
              startMarker: {
                icon: "marker",
                iconOptions: {
                  size: "md",
                  primaryColor: "#101820",
                  secondaryColor: "#417505"
                },
                draggable: false,
                title: "You are here"
              },
              endMarker: {
                icon: "marker",
                iconOptions: {
                  size: "md",
                  primaryColor: "#ffa500",
                  secondaryColor: "#ffa500",
                  symbol: "S"
                },
                title: data.results[i].poi.name
              },
              routeRibbon: {
                color: "#2aa6ce",
                opacity: 1.0,
                showTraffic: false
              },
              directionsResponse: response
            });
            customLayer.addTo(fg);
          }
        }
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
      {/* <Button onClick={() => handleClickAdd()}>Add Marker</Button>
      <Button onClick={() => handleClickRemove()}>Remove Marker</Button>
      <Button onClick={() => handleClick()}>Toggle Marker</Button>
      <Button onClick={() => handleApiCall()}>Make API Call</Button>
      <Button onClick={() => findNearbyRestaurants()}>
        Find Nearby Restaurants
      </Button>
      <Button onClick={() => findNearbyHospitals()}>
        Find Nearby Hospital
      </Button>
      <Button onClick={() => findNearbyShoppingCenters()}>
        Find Nearby Shopping Centers
      </Button> */}
    </>
  );
});

export default Map;
