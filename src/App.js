import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import './App.css';

class App extends Component {
  render() {
    // Create Map component
    const Map = withScriptjs(withGoogleMap(props => (
      <GoogleMap defaultCenter={{lat: 40.441643, lng: -74.511790}} defaultZoom={13}>
        <Marker title="Regal Commerce Center Stadium 18" position={{lat: 40.443312, lng: -74.503794}}>
          <InfoWindow><div>Regal Commerce Center Stadium 18</div></InfoWindow>
        </Marker>
        <Marker title="Crystal Springs Family Waterpark" position={{lat: 40.408719, lng: -74.446151}}>
          <InfoWindow><div>Crystal Springs Family Waterpark</div></InfoWindow>
        </Marker>
        <Marker title="Costco Wholesale" position={{lat: 40.436565, lng: -74.507282}}>
          <InfoWindow><div>Costco Wholesale</div></InfoWindow>
        </Marker>
        <Marker title="Rutgers Gardens" position={{lat: 40.473683, lng: -74.423132}}>
          <InfoWindow><div>Rutgers Gardens</div></InfoWindow>
        </Marker>
        <Marker title="Bunker Hill Golf Course" position={{lat: 40.437306, lng: -74.575925}}>
          <InfoWindow><div>Bunker Hill Golf Course</div></InfoWindow>
        </Marker>
      </GoogleMap>
    )));

    return (
      <div className="App">
        <Map
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAgW5OHRMNIfawf6DfY_UpnK1MqtJyN87E&v=3"
          loadingElement={<div className="map-loading"/>}
          containerElement={<div className="map-container"/>}
          mapElement={<div className="map"/>}/>
      </div>
    );
  }
}

export default App;
