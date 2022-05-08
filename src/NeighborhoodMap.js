import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import PropTypes from "prop-types";

// Alert when Google Maps authentication fails
window.gm_authFailure = () => {
  alert("Google Maps authentication failed.");
};

const NeighborhoodMap = ({ markers, onToggleInfoWindow }) => {
  // Ensure props are the right variable type
  // static propTypes = {
  //   markers: PropTypes.array.isRequired,
  //   onToggleInfoWindow: PropTypes.func.isRequired,
  // };

  const center = { lat: 40.73971790095217, lng: -74.01005037971146 };

  return (
    // <Map
    //   loadingElement={<div className="map-loading" />}
    //   containerElement={<div className="map-container" />}
    //   mapElement={
    //     <div
    //       className="map"
    //       role="application"
    //       tabIndex={0}
    //       aria-label="Map of neighborhood"
    //     />
    //   }
    //   markers={markers}
    //   onToggleInfoWindow={onToggleInfoWindow}
    // />
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="map"
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Can cycle through markers using the arrow keys */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            title={marker.title}
            position={marker.position}
            animation={marker.animation}
            visible={marker.isVisible}
            onClick={() => onToggleInfoWindow(marker)}
          >
            {marker.showInfo && (
              <InfoWindow
                position={marker.position}
                onCloseClick={() => onToggleInfoWindow(marker)}
              >
                {marker.url ? (
                  <div key={marker.id} className="marker-window">
                    <a className="marker-url" href={marker.url}>
                      {marker.title}
                    </a>
                    <img
                      className="marker-image"
                      src={marker.image}
                      alt={marker.title}
                    />
                    <a className="marker-yelp" href="https://www.yelp.com">
                      Yelp Reviews
                    </a>
                    {marker.reviews ? (
                      marker.reviews.map((review) => (
                        // An alternative to creating another div child
                        <React.Fragment key={review.id}>
                          <h3 className="marker-rating">
                            Rating: {review.rating}
                          </h3>
                          <p className="marker-review">{review.text}</p>
                        </React.Fragment>
                      ))
                    ) : (
                      <h3 className="error-message">
                        Error! Yelp reviews were unable to load.
                      </h3>
                    )}
                  </div>
                ) : (
                  <h3 className="error-message">
                    Error! Yelp could not find the location selected.
                  </h3>
                )}
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
};

export default NeighborhoodMap;
