/* global google */
import React, {Component} from 'react';
import $ from 'jquery';
import './App.css';
import ListView from './ListView';
import NeighborhoodMap from './NeighborhoodMap';
import markerData from './markers.json';

// cors-anywhere bypasses the cross-origin resource sharing error
const proxy = 'https://cors-anywhere.herokuapp.com/';
//const proxy = 'https://crossorigin.me/'; // Backup in case cors-anywhere is down
const api = 'Bearer 5gHT0N2H91kvYB8spnGJj0SD4Cub-O1qp35smS1pSrs0BFyGEayFl6W7AZWROPauJ2TU5gOcm2B1Otx' +
  'adbNvCb0hcu_PFngOKC1f5a4QzgI5lR1gt2WeZoBa7zNeW3Yx';
// Define google if it's not defined already
window.google = typeof google !== 'undefined' ? google : null;

class App extends Component {
  state = {
    // Initial markers
    markers: JSON.parse(JSON.stringify(markerData))
  };

  componentDidMount() {
    const markers = [...this.state.markers]; // Make a copy of markers
    markers.map(marker => {
      // Set common properties of all markers
      marker.animation = google.maps.Animation.DROP;
      marker.showInfo = false;
      marker.isVisible = true;
      // Click focused marker when user hits enter
      document.addEventListener('keyup', event =>
        event.target.title === marker.title && event.keyCode === 13 && this.toggleInfoWindow(marker)
      );
      // Get image and reviews from Yelp
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
    marker.animation = marker.showInfo && google ? google.maps.Animation.BOUNCE : null;
    this.setState({markers});
  };

  // Filter markers based on search query
  filterLocations = (event, query) => {
    event.preventDefault();
    const markers = [...this.state.markers];
    markers.map(marker => {
      // Marker drops if it becomes visible
      if (!marker.isVisible && google)
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
    // Apply focus to all markers
    const mapElements = [...document.querySelectorAll('.gmnoprint')].slice(0, markers.length);
    mapElements.map(element => element.tabIndex = 0);

    return (
      <div className="App">
        <ListView markers={markers} onToggleInfoWindow={this.toggleInfoWindow}
          onFilterLocations={this.filterLocations}/>
        {google ? (
          <NeighborhoodMap markers={markers} onToggleInfoWindow={this.toggleInfoWindow}/>
        ) : (
          <h1 className="error-message google" tabIndex={0}>Error! Google Maps was unable to load.</h1>
        )}
      </div>
    );
  }
}

export default App;
