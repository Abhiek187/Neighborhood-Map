import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import PropTypes from "prop-types";

// Create Map component at the very top to render the entire map once
// const Map = withGoogleMap((props) => (
//   <GoogleMap center={center} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
//     {props.markers.map((marker) => (
//       <Marker
//         key={marker.id}
//         title={marker.title}
//         position={marker.position}
//         animation={marker.animation}
//         visible={marker.isVisible}
//         onClick={() => props.onToggleInfoWindow(marker)}
//       >
//         {marker.showInfo && (
//           <InfoWindow onCloseClick={() => props.onToggleInfoWindow(marker)}>
//             {marker.url ? (
//               <div key={marker.id} className="marker-window">
//                 <a className="marker-url" href={marker.url}>
//                   {marker.title}
//                 </a>
//                 <img
//                   className="marker-image"
//                   src={marker.image}
//                   alt={marker.title}
//                   tabIndex={0}
//                 />
//                 <a className="marker-yelp" href="https://www.yelp.com">
//                   Yelp Reviews
//                 </a>
//                 {marker.reviews ? (
//                   marker.reviews.map((review) => (
//                     // An alternative to creating another div child
//                     <React.Fragment key={review.id}>
//                       <h3 className="marker-rating" tabIndex={0}>
//                         Rating: {review.rating}
//                       </h3>
//                       <p className="marker-review" tabIndex={0}>
//                         {review.text}
//                       </p>
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   <h3 className="error-message" tabIndex={0}>
//                     Error! Yelp reviews were unable to load.
//                   </h3>
//                 )}
//               </div>
//             ) : (
//               <h3 className="error-message" tabIndex={0}>
//                 Error! Yelp could not find the location selected.
//               </h3>
//             )}
//           </InfoWindow>
//         )}
//       </Marker>
//     ))}
//   </GoogleMap>
// ));

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

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

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
              <InfoWindow onCloseClick={() => onToggleInfoWindow(marker)}>
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
