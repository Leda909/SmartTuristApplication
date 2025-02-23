// this is the link to the autocomplete plugin
// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete

// https://developers.google.com/maps/documentation/javascript/place-autocomplete#javascript

// map.js

// const fetchAPIKey = async () => {
//     try {
//         const response = await fetch('/api-key');  // Ensure this URL matches the endpoint in app.js
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         return data.apiKey;
//     } catch (error) {
//         console.error('Error fetching API key:', error);
//         return null;
//     }
// };

// // Load Google Maps API dynamically with async loading
// const loadGoogleMapsAPI = (apiKey) => {
//     return new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapCallback`;
//         script.async = true;  // Ensure async loading
//         script.defer = true;  // Ensure the script is executed after parsing
//         script.onload = resolve;
//         script.onerror = reject;
//         document.head.appendChild(script);
//     });
// };

// // Initialize and add the map
// let map;

// const initMapCallback = async () => {
//     try {
//         // Request needed libraries
//         const { Map } = await google.maps.importLibrary('maps');
//         const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

//         navigator.geolocation.getCurrentPosition((position) => {
//             const userPosition = { lat: position.coords.latitude, lng: position.coords.longitude };

//             map = new Map(document.getElementById('map'), {
//                 zoom: 15,
//                 center: userPosition,
//                 // Remove mapId if not using it
//                 // mapId: 'DEMO_MAP_ID', 
//                 backgroundColor: 'pink',
//             });

//             new AdvancedMarkerElement({
//                 map: map,
//                 position: userPosition,
//                 title: 'You are here'
//             });
//         }, (error) => {
//             console.error('Error getting location:', error);
//             // Optionally handle errors and provide user feedback
//         });
//     } catch (error) {
//         console.error('Error initializing map:', error);
//         // Optionally handle errors and provide user feedback
//     }
// };

// // Load the Google Maps API and initialize the map
// fetchAPIKey().then(apiKey => {
//     if (apiKey) {
//         loadGoogleMapsAPI(apiKey).then(() => {
//             // Google Maps API loaded successfully
//         }).catch((error) => {
//             console.error('Error loading Google Maps API:', error);
//             // Optionally handle errors and provide user feedback
//         });
//     }
// });


// const loadGoogleMapsAPI = (apiKey) => {
//     return new Promise((resolve, reject) => {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBki1OuAdY0Y0CJ139WqEN-6D6qDbBh46w&libraries=places&callback=initMapCallback`;
//         script.async = true;  // Ensure async loading
//         script.defer = true;  // Ensure the script is executed after parsing
//         script.onload = resolve;
//         script.onerror = reject;
//         document.head.appendChild(script);
//     });
// };


(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "AIzaSyBki1OuAdY0Y0CJ139WqEN-6D6qDbBh46w",
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});


function initAutocomplete(){
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

        const currentUserPosition = { lat: lat, lng: lng };
        
        // const map = new google.maps.Map(document.getElementById('map'), {
        //     center: { lat: lat, lng: lng },
        //     zoom: 15,
        //   });
      
        //   new google.maps.Marker({
        //     position: { lat: lat, lng: lng },
        //     map: map,
        //   });

        const map = new Map(document.getElementById("map"), {
            zoom: 15,
            center: currentUserPosition,
            mapId: "DEMO_MAP_ID",
        });
    
        new AdvancedMarkerElement({
            map: map,
            position: currentUserPosition,
            title: 'You are here'
        });

      });
}

// Initialize and add the map
let map;

async function initMap() {


    initAutocomplete()
    document.addEventListener('DOMContentLoaded', initAutocomplete);

    // const center = { lat: 50.064192, lng: -130.605469 };
    // Create a bounding box with sides ~10km away from the center point
    // const defaultBounds = {
    //     north: center.lat + 0.1,
    //     south: center.lat - 0.1,
    //     east: center.lng + 0.1,
    //     west: center.lng - 0.1,
    // };
    
    // const options = {
    //     bounds: defaultBounds,
    //     componentRestrictions: { country: "us" },
    //     fields: ["address_components", "geometry", "icon", "name"],
    //     strictBounds: false,
    // };

    
    // The location of Uluru
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//             navigator.geolocation.getCurrentPosition((position) => {
//                  doSomething(position.coords.latitude, position.coords.longitude);
//              });
    
    const defaultPosition = { lat: 51.501364, lng: -0.1444649 };
    
    const map = new Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultPosition,
        mapId: "DEMO_MAP_ID",
    });

    navigator.geolocation.getCurrentPosition((position) => {
        const currentUserPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
        
        const map = new Map(document.getElementById("map"), {
            zoom: 15,
            center: currentUserPosition,
            mapId: "DEMO_MAP_ID",
        });
    
        new AdvancedMarkerElement({
            map: map,
            position: currentUserPosition,
            title: 'You are here'
        });

    });

    // const markerPosition = { lat: -24, lng: 130 };
    // new AdvancedMarkerElement({
    //     map: map,
    //     position: markerPosition,
    //     title: 'A'
    // });

    // const markerBPosition = { lat: -25, lng: 132 };
    // new AdvancedMarkerElement({
    //     map: map,
    //     position: markerBPosition,
    //     title: 'B'
    // });

    // const markerCPosition = { lat: -27, lng: 122 };
    // new AdvancedMarkerElement({
    //     map: map,
    //     position: markerCPosition,
    //     title: 'C'
    // });

}

initMap();

//Idea
// async function initMap() {
//     const { Map } = await google.maps.importLibrary("maps");
//     const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//     const defaultLocation = { lat: -25.344, lng: 131.036 };
//     map = new Map(document.getElementById("map"), {
//         zoom: 4,
//         center: defaultLocation,
//     });
// }

// async function placeMarker(position) {
//     const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

//     new AdvancedMarkerElement({
//         map: map,
//         position: position,
//         title: 'You are here'
//     });

//     map.setZoom(15);
//     map.setCenter(position);
// }

// initMap();