/* global google */
import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import './App.css';

// Create Map component at the very top to render the entire map once
const Map = withGoogleMap(props => (
  <GoogleMap defaultCenter={{lat: 40.441643, lng: -74.511790}} defaultZoom={12}>
    {props.markers.map(marker => (
      <Marker key={marker.id} title={marker.title} position={marker.position}
        animation={marker.animation} visible={marker.isVisible}
        onClick={() => props.toggleInfoWindow(marker)}>
        {marker.showInfo && <InfoWindow onCloseClick={() => props.toggleInfoWindow(marker)}>
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
        showInfo: false,
        isVisible: true
      },
      {
        id: 'crystal-springs-family-waterpark',
        title: 'Crystal Springs Family Waterpark',
        position: {lat: 40.408711, lng: -74.445983},
        animation: google.maps.Animation.DROP,
        showInfo: false,
        isVisible: true
      },
      {
        id: 'milltown-ice-cream-depot',
        title: 'Milltown Ice Cream Depot',
        position: {lat: 40.453293, lng: -74.434404},
        animation: google.maps.Animation.DROP,
        showInfo: false,
        isVisible: true
      },
      {
        id: 'pro-skate',
        title: 'Pro Skate',
        position: {lat: 40.415439, lng: -74.528226},
        animation: google.maps.Animation.DROP,
        showInfo: false,
        isVisible: true
      },
      {
        id: 'regal-commerece-center-stadium-18',
        title: 'Regal Commerce Center Stadium 18',
        position: {lat: 40.443312, lng: -74.503794},
        animation: google.maps.Animation.DROP,
        showInfo: false,
        isVisible: true
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

  filterLocations = event => {
    event.preventDefault();
    const markers = [...this.state.markers];
    const query = document.querySelector('.list-search').value;
    markers.map(marker => {
      // Marker drops if becomes visible
      if (!marker.isVisible)
        marker.animation = google.maps.Animation.DROP; // Take a chance to drop before filtering
      // Case-insensitive filter
      marker.isVisible = marker.title.toLowerCase().includes(query.toLowerCase());
      if (!marker.isVisible) {
        marker.showInfo = false; // Don't show info window if marker is invisible
        marker.animation = null; // Filter unsuccessful, remain null
      }
      return marker;
    });
    this.setState({markers});
  };

  render() {
    const {markers} = this.state;

    return (
      <div className="App">
        <div className="list-view">
          <h1 className="list-title">Neighborhood Map</h1>
          <form className="list-form" onSubmit={e => this.filterLocations(e)}>
            <input className="list-search" type="text" placeholder="Search location"/>
            <input className="list-submit" type="submit" value="Search"/>
          </form>
          <div className="list-locations">
            {markers.filter(marker => marker.isVisible).map(marker => (
              <div key={marker.id}>
                <button className={marker.showInfo ? 'list-button selected' : 'list-button'} type="button"
                  onClick={() => this.toggleInfoWindow(marker)}>{marker.title}</button>
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
