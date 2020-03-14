import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle
} from "react";
import Map from "./Components/Map.jsx";
import "semantic-ui-css/semantic.min.css";
import {
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Button
} from "semantic-ui-react";
function App() {
  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [activeItem, setActiveItem] = useState("Actions");
  const handleItemClick = () => {
    setVisible(!visible);
    console.log(visible);
  };
  return (
    <>
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item
            name="Actions"
            active={activeItem === "Actions"}
            onClick={() => {
              setActiveItem("Actions");
              handleItemClick();
            }}
          />
          <Menu.Item
            name="Get Info"
            active={activeItem === "Get Info"}
            onClick={() => {
              setActiveItem("Get Info");
              handleItemClick();
            }}
          />
        </Menu>
      </Segment>
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation="overlay"
          direction="left"
          icon="labeled"
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width="thin"
        >
          <Menu.Item
            as="a"
            onClick={() => {
              childRef.current.handleApiCallWrapper();
              handleItemClick();
            }}
          >
            Get Future Possible Location
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={() => {
              childRef.current.findNearbyShoppingCentersWrapper();
              handleItemClick();
            }}
          >
            Find Nearby ShoppingCenters
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={() => {
              childRef.current.findNearbyRestaurantsWrapper();
              handleItemClick();
            }}
          >
            Find Nearby Restaurants
          </Menu.Item>
          <Menu.Item
            as="a"
            onClick={() => {
              childRef.current.findNearbyHospitalsWrapper();
              handleItemClick();
            }}
          >
            Find Nearby Hospitals
          </Menu.Item>
        </Sidebar>

        <Sidebar
          as={Menu}
          animation="overlay"
          direction="right"
          inverted
          vertical
          visible={visible}
        >
          <Menu.Item as="a" header>
            Points of Interest Info And Routes
          </Menu.Item>
          <Menu.Item as="a">Shopping Center Info</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>
          <div id="map" style={({ width: 10 }, { height: 800 })}></div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <div>
        <Map ref={childRef} />
      </div>
    </>
  );
}

export default App;
