import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import './App.css';

class App extends Component {
  render() {
    // Create Map component
    const Map = withScriptjs(withGoogleMap(props => (
      <GoogleMap defaultCenter={{lat: 40.441815, lng: -74.511608}} defaultZoom={13}>
        <Marker position={{lat: 40.4288947, lng: -74.5139918}}/>
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
