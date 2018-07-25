import React, { Component } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <GoogleMapReact
          bootstrapURLKeys={{key: 'AIzaSyAgW5OHRMNIfawf6DfY_UpnK1MqtJyN87E'}}
          defaultCenter={{lat: 40.441815, lng: -74.511608}}
          defaultZoom={13}
        ></GoogleMapReact>
      </div>
    );
  }
}

export default App;
