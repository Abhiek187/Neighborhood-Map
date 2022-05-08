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
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback((map) => {
    /* Set the center and zoom here instead of in GoogleMap to prevent the map from snapping
     * back to the center when closing out of an info window
     */
    const bounds = new window.google.maps.LatLngBounds();
    map.setCenter(center);
    map.setZoom(13);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map) => {
    setMap(null);
  }, []);

  const center = { lat: 40.73971790095217, lng: -74.01005037971146 };

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerClassName="map"
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
