/* global google */
import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import './App.css';

// Create Map component at the very top to render the entire map once
const Map = withGoogleMap(props => (
  <GoogleMap defaultCenter={{lat: 40.441643, lng: -74.511790}} defaultZoom={12}>
    {props.markers.map(marker => (
      <Marker key={marker.id} title={marker.title} position={marker.position}
        animation={marker.animation} onClick={() => {props.toggleInfoWindow(marker)}}>
        {marker.showInfo && <InfoWindow onCloseClick={() => {props.toggleInfoWindow(marker)}}>
          <div>{marker.title}</div>
        </InfoWindow>}
      </Marker>
    ))}
  </GoogleMap>
));

class App extends Component {
  state = {
    // Initial markers
    markers: [
      {
        id: 'costco-wholesale',
        title: 'Costco Wholesale',
        position: {lat: 40.436565, lng: -74.507282},
        animation: google.maps.Animation.DROP,
        showInfo: false
      },
      {
        id: 'crystal-springs-family-waterpark',
        title: 'Crystal Springs Family Waterpark',
        position: {lat: 40.408711, lng: -74.445983},
        animation: google.maps.Animation.DROP,
        showInfo: false
      },
      {
        id: 'milltown-ice-cream-depot',
        title: 'Milltown Ice Cream Depot',
        position: {lat: 40.453293, lng: -74.434404},
        animation: google.maps.Animation.DROP,
        showInfo: false
      },
      {
        id: 'pro-skate',
        title: 'Pro Skate',
        position: {lat: 40.415439, lng: -74.528226},
        animation: google.maps.Animation.DROP,
        showInfo: false
      },
      {
        id: 'regal-commerece-center-stadium-18',
        title: 'Regal Commerce Center Stadium 18',
        position: {lat: 40.443312, lng: -74.503794},
        animation: google.maps.Animation.DROP,
        showInfo: false
      }
    ]
  };

  toggleInfoWindow = marker => {
    const markers = [...this.state.markers]; // Make a copy of markers
    marker = markers.filter(m => m.id === marker.id)[0]
    marker.showInfo = !marker.showInfo;
    marker.animation = marker.showInfo ? google.maps.Animation.BOUNCE : null;
    this.setState({markers});
  };

  render() {
    const {markers} = this.state;

    return (
      <div className="App">
        <div className="list-view">
          <h1 className="list-title">Neighborhood Map</h1>
          <span className="list-searchbox">
            <input className="list-search" type="text" placeholder="Search location"/>
            <input className="list-submit" type="submit" value="Search"/>
          </span>
          <div className="list-locations">
            {markers.map(marker => (
              <div key={marker.id}>
                <button className="list-button" type="button"
                  onClick={() => {this.toggleInfoWindow(marker)}}>{marker.title}</button>
                <hr/>
              </div>
            ))}
          </div>
        </div>
        <Map
          loadingElement={<div className="map-loading"/>}
          containerElement={<div className="map-container"/>}
          mapElement={<div className="map"/>}
          markers={markers}
          toggleInfoWindow={this.toggleInfoWindow}/>
      </div>
    );
  }
}

export default App;
