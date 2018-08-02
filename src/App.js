/* global google */
// TODO: Responsiveness, a11y, service worker, separate files
import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import $ from 'jquery';
import './App.css';

// cors-anywhere bypasses the cross-origin resource sharing error
const proxy = 'https://cors-anywhere.herokuapp.com/';
const api = 'Bearer 5gHT0N2H91kvYB8spnGJj0SD4Cub-O1qp35smS1pSrs0BFyGEayFl6W7AZWROPauJ2TU5gOcm2B1Otx' +
  'adbNvCb0hcu_PFngOKC1f5a4QzgI5lR1gt2WeZoBa7zNeW3Yx';

// Create Map component at the very top to render the entire map once
const Map = withGoogleMap(props => (
  <GoogleMap defaultCenter={{lat: 40.441643, lng: -74.511790}} defaultZoom={12}>
    {props.markers.map(marker => (
      <Marker key={marker.id} title={marker.title} position={marker.position}
        animation={marker.animation} visible={marker.isVisible}
        onClick={() => props.toggleInfoWindow(marker)}>
        {marker.showInfo && <InfoWindow onCloseClick={() => props.toggleInfoWindow(marker)}>
          {marker.url ? (
            <div key={marker.id} className="marker-window">
              <a className="marker-url" href={marker.url}>{marker.title}</a>
              <img className="marker-image" src={marker.image} alt={marker.title}/>
              <a className="marker-yelp" href="https://www.yelp.com">Yelp Reviews</a>
              {marker.reviews ? (
                marker.reviews.map(review => (
                  // An alternative to creating another div child
                  <React.Fragment key={review.id}>
                    <h3 className="marker-rating">Rating: {review.rating}</h3>
                    <p className="marker-review">{review.text}</p>
                  </React.Fragment>
                ))
              ) : (
                <h3 className="error-message">Error! Yelp reviews were unable to load.</h3>
              )}
            </div>
          ) : (
            <h3 className="error-message">Error! Yelp could not find the location selected.</h3>
          )}
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
        id: 'costco',
        title: 'Costco',
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
        id: 'pro-skate-nj',
        title: 'Pro Skate NJ',
        position: {lat: 40.415439, lng: -74.528226},
        animation: google.maps.Animation.DROP,
        showInfo: false,
        isVisible: true
      },
      {
        id: 'regal-cinemas-commerece-center-18',
        title: 'Regal Cinemas Commerce Center 18',
        position: {lat: 40.443312, lng: -74.503794},
        animation: google.maps.Animation.DROP,
        showInfo: false,
        isVisible: true
      }
    ],
    // Search query
    query: ''
  };

  componentDidMount() {
    // Get image and reviews from Yelp
    const markers = [...this.state.markers]; // Make a copy of markers
    markers.map(marker => {
      this.getBusiness(marker).done(data => {
        marker.id = data.businesses[0].id;
        marker.url = data.businesses[0].url;
        marker.image = data.businesses[0].image_url;
        this.getReviews(marker.id).done(data => {
          marker.reviews = [];
          for (const review of data.reviews) {
            marker.reviews.push({
              id: review.id,
              rating: review.rating,
              text: review.text
            });
          }
        }).fail((xhr, textStatus, error) => console.error(`Error: ${error}`));
      }).fail((xhr, textStatus, error) => console.error(`Error: ${error}`));

      return marker;
    });

    this.setState({markers}); // Set markers to the clone created above
  }

  getBusiness = marker =>
    $.ajax({
      // Marker title matches title on Yelp for better search results
      url: proxy + `https://api.yelp.com/v3/businesses/search?latitude=${marker.position.lat}` +
        `&longitude=${marker.position.lng}&term=${marker.title}`,
      headers: {
        Authorization: api
      }
    });

  getReviews = id =>
    $.ajax({
      url: proxy + `https://api.yelp.com/v3/businesses/${id}/reviews`,
      headers: {
        Authorization: api
      }
    });

  // Control marker behavior and info window when clicked
  toggleInfoWindow = marker => {
    const markers = [...this.state.markers];
    marker = markers.filter(m => m.id === marker.id)[0];
    marker.showInfo = !marker.showInfo;
    marker.animation = marker.showInfo ? google.maps.Animation.BOUNCE : null;
    this.setState({markers});
  };

  // Filter markers based on search query
  filterLocations = event => {
    event.preventDefault();
    const markers = [...this.state.markers];
    const query = this.state.query;
    markers.map(marker => {
      // Marker drops if it becomes visible
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
        {/* List view of markers */}
        <div className="list-view">
          <h1 className="list-title">Neighborhood Map</h1>
          <form className="list-form" onSubmit={e => this.filterLocations(e)}>
            <input className="list-search" type="text" placeholder="Search location"
              onChange={e => this.setState({query: e.target.value})}/>
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
        {/* Map compoenent */}
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
