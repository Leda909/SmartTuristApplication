async function fetchGoogleApiKey() {
    const response = await fetch('/api-keys/google');
    const data = await response.json();
    return data.googleApiKey;
}


function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.body.appendChild(script);
}

function initAutocomplete(map) {
    const input = document.getElementById('YourLocation');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log(place.name);
            return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        console.log('Latitude:', lat, 'Longitude:', lng);

        // Update hidden fields
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;

        const currentUserPosition = { lat: lat, lng: lng };
        map.setCenter(currentUserPosition);

        new google.maps.Marker({
            position: currentUserPosition,
            map: map,
            title: 'You are here',
        });

        
    });
}

function initMap() {
    const defaultPosition = { lat: 51.501364, lng: -0.1444649 };

    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: defaultPosition,
        mapId: "DEMO_MAP_ID",
    });

    initAutocomplete(map);
}

// Function to add markers to the map
// function addMarkersToMap(places,) {
//     places.forEach(place => {
//         const { lat, lng } = place.location; // Extract lat and lng from place.location
        
//         console.log('Place Map Location:', place.name, 'Latitude:', lat, 'Longitude:', lng);

//         new google.maps.Marker({
//             position: { lat, lng }, // Use the extracted lat and lng
//             map: map,
//             title: place.name,
//             icon: {
//                 url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon
//             }
//         });
//     });
// }



// Load the Google Maps API and initialize the map
// loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyBki1OuAdY0Y0CJ139WqEN-6D6qDbBh46w&libraries=places&callback=initMap`, () => {
//     console.log('Google Maps API script loaded successfully.');
// });

async function loadMap() {
    const googleApiKey = await fetchGoogleApiKey();
    console.log(googleApiKey); //here
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&callback=initMap`, () => {
        console.log('Google Maps API script loaded successfully.');
    });
}

loadMap();
// initMap();

// Expose addMarkersToMap globally
// window.addMarkersToMap = addMarkersToMap;

// Export functions for use in other modules

// module.exports = { addMarkersToMap };

