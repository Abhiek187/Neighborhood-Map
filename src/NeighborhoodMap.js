import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import PropTypes from 'prop-types';

// Create Map component at the very top to render the entire map once
const Map = withGoogleMap(props => (
  <GoogleMap defaultCenter={{lat: 40.441643, lng: -74.511790}} defaultZoom={12}>
    {props.markers.map(marker => (
      <Marker key={marker.id} title={marker.title} position={marker.position}
        animation={marker.animation} visible={marker.isVisible}
        onClick={() => props.onToggleInfoWindow(marker)}>
        {marker.showInfo && <InfoWindow onCloseClick={() => props.onToggleInfoWindow(marker)}>
          {marker.url ? (
            <div key={marker.id} className="marker-window">
              <a className="marker-url" href={marker.url}>{marker.title}</a>
              <img className="marker-image" src={marker.image} alt={marker.title} tabIndex={0}/>
              <a className="marker-yelp" href="https://www.yelp.com">Yelp Reviews</a>
              {marker.reviews ? (
                marker.reviews.map(review => (
                  // An alternative to creating another div child
                  <React.Fragment key={review.id}>
                    <h3 className="marker-rating" tabIndex={0}>Rating: {review.rating}</h3>
                    <p className="marker-review" tabIndex={0}>{review.text}</p>
                  </React.Fragment>
                ))
              ) : (
                <h3 className="error-message" tabIndex={0}>Error! Yelp reviews were unable to load.</h3>
              )}
            </div>
          ) : (
            <h3 className="error-message" tabIndex={0}>
              Error! Yelp could not find the location selected.
            </h3>
          )}
        </InfoWindow>}
      </Marker>
    ))}
  </GoogleMap>
));

class NeighborhoodMap extends Component {
	// Ensure props are the right variable type
	static propTypes = {
		markers: PropTypes.array.isRequired,
		onToggleInfoWindow: PropTypes.func.isRequired
	};

	render() {
		const {markers, onToggleInfoWindow} = this.props;

		return (
			<Map loadingElement={<div className="map-loading"/>}
				containerElement={<div className="map-container"/>} mapElement={<div className="map"/>}
        markers={markers} onToggleInfoWindow={onToggleInfoWindow}/>
		);
	}
}

export default NeighborhoodMap;
