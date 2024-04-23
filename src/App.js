import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import "./App.css";
import ListView from "./ListView";
import NeighborhoodMap from "./NeighborhoodMap";
import markerData from "./markers.json";

// cors-anywhere bypasses the cross-origin resource sharing error
const proxy = "https://still-waters-67678.onrender.com/"; // my proxy
//const proxy = "https://cors-anywhere.herokuapp.com/"; // demo proxy
//const proxy = "https://crossorigin.me/"; // Backup in case cors-anywhere is down
const yelpApiKey =
  "Bearer 5gHT0N2H91kvYB8spnGJj0SD4Cub-O1qp35smS1pSrs0BFyGEayFl6W7AZWROPauJ2TU5gOcm2B1Otx" +
  "adbNvCb0hcu_PFngOKC1f5a4QzgI5lR1gt2WeZoBa7zNeW3Yx";

const libraries = ["marker"];

const App = () => {
  // Initial markers
  const [markers, setMarkers] = React.useState(
    JSON.parse(JSON.stringify(markerData))
  );
  const { isLoaded, loadError } = useJsApiLoader({
    // Inject loading=async for now until @react-google-maps/api v2.19.4+ is released
    // https://github.com/JustFly1984/react-google-maps-api/issues/3334
    googleMapsApiKey: "AIzaSyAgW5OHRMNIfawf6DfY_UpnK1MqtJyN87E&loading=async",
    // Also waiting until Advanced Markers are supported
    // https://github.com/JustFly1984/react-google-maps-api/issues/3250
    libraries,
  });

  React.useEffect(() => {
    if (isLoaded) {
      // Perform asynchronous functions after Google Maps has loaded successfully
      const newMarkers = [...markers]; // Make a copy of markers
      newMarkers.map(async (marker) => {
        // Set common properties of all markers
        marker.animation = window.google ? google.maps.Animation.DROP : null;
        marker.showInfo = false;
        marker.isVisible = true;
        // Click focused marker when user hits enter
        document.addEventListener(
          "keyup",
          (event) =>
            event.target.title === marker.title &&
            event.key === "Enter" &&
            toggleInfoWindow(marker)
        );

        await fetchYelpBusinessAndReviews(marker);
        return marker;
      });

      setMarkers(newMarkers); // Set markers to the clone created above
    }
  }, [isLoaded]);

  const fetchYelpBusinessAndReviews = async (marker) => {
    // Get image and reviews from Yelp
    try {
      // Marker title matches title on Yelp for better search results
      const businessUrl =
        `${proxy}https://api.yelp.com/v3/businesses/search?latitude=${marker.position.lat}` +
        `&longitude=${marker.position.lng}&term=${marker.title}`;
      const businessResponse = await fetch(businessUrl, {
        headers: {
          Authorization: yelpApiKey,
        },
      });
      const businessData = await businessResponse.json();

      marker.id = businessData.businesses[0].id;
      marker.url = businessData.businesses[0].url;
      marker.image = businessData.businesses[0].image_url;

      const reviewsUrl = `${proxy}https://api.yelp.com/v3/businesses/${marker.id}/reviews`;
      const reviewsResponse = await fetch(reviewsUrl, {
        headers: {
          Authorization: yelpApiKey,
        },
      });
      const reviewsData = await reviewsResponse.json();

      marker.reviews = [];
      for (const review of reviewsData.reviews) {
        marker.reviews.push({
          id: review.id,
          rating: review.rating,
          text: review.text,
        });
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  // Control marker behavior and info window when clicked
  const toggleInfoWindow = (marker) => {
    const newMarkers = [...markers];
    marker = newMarkers.filter((m) => m.id === marker.id)[0];
    marker.showInfo = !marker.showInfo;
    marker.animation =
      marker.showInfo && window.google ? google.maps.Animation.BOUNCE : null;
    setMarkers(newMarkers);
  };

  // Filter markers based on search query
  const filterLocations = (event, query) => {
    event.preventDefault();
    const newMarkers = [...markers];
    newMarkers.map((marker) => {
      // Marker drops if it becomes visible
      if (!marker.isVisible && window.google)
        marker.animation = google.maps.Animation.DROP; // Take a chance to drop before filtering
      // Case-insensitive filter
      marker.isVisible = marker.title
        .toLowerCase()
        .includes(query.toLowerCase());
      if (!marker.isVisible) {
        marker.showInfo = false; // Don't show info window if marker is invisible
        marker.animation = null; // Filter unsuccessful, remain null
      }
      return marker;
    });

    setMarkers(newMarkers);
  };

  // Placeholder when map doesn't appear
  const placeholder = loadError ? (
    <h1 className="error-message google">
      Error! Google Maps was unable to load.
    </h1>
  ) : (
    <p className="loading">Loading...</p>
  );

  return (
    <div className="App">
      <ListView
        markers={markers}
        onToggleInfoWindow={toggleInfoWindow}
        onFilterLocations={filterLocations}
      />
      {isLoaded ? (
        <NeighborhoodMap
          markers={markers}
          onToggleInfoWindow={toggleInfoWindow}
        />
      ) : (
        placeholder
      )}
    </div>
  );
};

export default React.memo(App);
