// async function fetchSubmittedLocation() {
//     const response = await fetch('/submittedLocation');
//     const data = await response.json();
//     return data.submittedLocation;
// }

// const submitForm = async (event) => {
//     event.preventDefault();
//     console.log('Form submitted');
//     const formData = new FormData(event.target);



//     const result = await fetch(`/submittedLocation`)
//     // Error handeling on const result for try and catch maybe no data submitted or not the right form

// }

// const { addMarkersToMap } = require('./map3');
// Use dynamic import to load map3.js when needed
// const loadMapModule = async () => {
//     const mapModule = await import('./map3.js');
//     return mapModule;
// };

// Import the displayPlaceList function from 
// const { displayPlaceList } = require('./displayResult');

const submitForm = async (event) => {
    event.preventDefault();
    console.log('Form submitted');

    const formData = new FormData(event.target);
    // console.log(`Recived formData: ${formData}`);

    // Convert FormData entries to an array and log them
    const formDataEntries = Array.from(formData.entries());
    console.log('Received formData entries:', formDataEntries);

    // If you need to log it as a JSON-like object
    const formDataObject = {};
    formDataEntries.forEach(([key, value]) => {
        formDataObject[key] = value;
    });
    console.log('FormData as object:', formDataObject);


    try {
        // This was prior idea to hide port number
        // const response = await fetch('/submittedLocation', {
        const response = await fetch(`http://localhost:4001/suggestionOfPlaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                typeOfPlace: formData.get('typeOfPlace'),
                startLocation: formData.get('YourLocation'),
                latitude: formData.get('latitude'),
                longitude: formData.get('longitude'),
                radius: formData.get('radius'),
            })
        });

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }

        // Check if the response is ok
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An unknown error occurred');
        }

        //---------------------------------------------------------------- RETURN VALUE


        // returned response / results of places requested
        const result = await response.json();

        console.log('Places fetched:', result);
        // Log each object individually
        result.forEach((place, index) => {
            // const defaultPosition = { lat: 51.501364, lng: -0.1444649 };
            // const map = new google.maps.Map(document.getElementById("map"), {
            //     zoom: 14,
            //     center: defaultPosition,
            //     mapId: "DEMO_MAP_ID",
            // });
            // new google.maps.Marker({
            //     position: place.location,
            //     map: map,
            //     title: 'You are here',
            // });
            console.log(`Place ${index + 1}:`, place);
        });

        // ------------------------------------------------------------------------------------------------
        // Example fetched result for testing without making Google Maps API calls
        // const result = [
        //     {
        //         "name": "K+K Hotel George Kensington",
        //         "address": "1-15 Templeton Pl, London SW5 9NB, UK",
        //         "location": {
        //             "lat": 51.492352,
        //             "lng": -0.195519
        //         },
        //         "website": "https://www.kkhotels.com/products/kk-hotel-george-kensington-london/",
        //         "phone_number": "+44 20 7598 8700",
        //         "acessibility": "No",
        //         "rating": 4.4,
        //         "opening_hours": null,
        //         "photos": [
        //             {
        //                 "photo_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AelY_CtkUe7GRhk_44neOo3RbL8ZZH721vOVnXAwD8BMFTfivwF98MZTBiZwwhpCwAzGUJKpZA71WDvdb-rEEKqCGrPLsjXfLCUWcsC_2yin1vB1GwFvmx_DVHS6-NWsCBAASL6x5pdZeWPfq25LB7pzdTOjlUoztCE8mCN_tG1qbM3SGa0C&key=AIzaSyBki1OuAdY0Y0CJ139WqEN-6D6qDbBh46w",
        //                 "attributions": [
        //                     "<a href=\"https://maps.google.com/maps/contrib/115341255782850890933\">K+K Hotel George Kensington</a>"
        //                 ]
        //             },
        //             {
        //                 "photo_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AelY_CvhKYrPujzlw62M5_ltD65CF3xaWYEmjVU5BJVStmv-jP_W9IV-8_u2PQvl8Z3s-9GHmd524ZACgpp3Cmm2poFxCIlKMwKM5JMhso_AaYf4DlI_cCb1sNsQ1mVa6sZLouOHe10BS640cgfKg4JQMRLA5uIW86lgx4V3Mn-URJcGK_mt&key=AIzaSyBki1OuAdY0Y0CJ139WqEN-6D6qDbBh46w",
        //                 "attributions": [
        //                     "<a href=\"https://maps.google.com/maps/contrib/115341255782850890933\">K+K Hotel George Kensington</a>"
        //                 ]
        //             },
        //             {
        //                 "photo_url": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AelY_Cvwu5a817lNOW2Kcoi7gNjJ3j1zx3lmEmlymlCbpEvYAfV7Q9OfWLQMzVnKQeDim-Obs3X8bDCrl48m1zJd4IHju26032xehu0BOTp-3b571TNJ1oAyb0uZZ2VmCEv34wb0iZw6-EUxJDDF6x18KkATMiEMSh2z6h9TAwY5NDX76NRV&key=AIzaSyBki1OuAdY0Y0CJ139WqEN-6D6qDbBh46w",
        //                 "attributions": [
        //                     "<a href=\"https://maps.google.com/maps/contrib/115341255782850890933\">K+K Hotel George Kensington</a>"
        //                 ]
        //             }
        //         ]
        //     }
        // ];
        // ------------------------------------------------------------------------------------------------
        // Example fetched result for testing 


        // Pass the result to the function in results.js
        // displayPlaceList(result);

        // Check if result is empty and handle it accordingly
        if (result.length === 0) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '<p>No places found within the specified radius. Try increasing the distance and search again.</p>';
            return;
        }

        // create the result Dom element
        const resultsDiv = document.getElementById('results');
        // Clear any previous results
        resultsDiv.innerHTML = '';


        // Create an unordered list to hold the place names
        const ul = document.createElement('ul');

        // Use map to iterate over the places and create list items
        // result.map((place, index) => {
        //     const li = document.createElement('li');
        //     li.textContent = `${place.name}`;
        //     li.style.cursor = 'pointer';
        //     const { lat, lng } = place.location;
        //     li.setAttribute("id", "id" + lat + "-" + lng);


        //     // Attach an event listener to display more information on click, but only display detail if is not null
        //     li.addEventListener('click', () => {
        //         // Toggle the display of additional information
        //         const detailsDiv = li.querySelector('.details');
        //         if (detailsDiv) {
        //             // Off
        //             detailsDiv.remove();
        //         } else {
        //             // On
        //             const details = document.createElement('div');
        //             details.className = 'details';

        //             // details.innerHTML = `
        //             //     <p><strong>Address:</strong> ${place.address || 'N/A'}</p>
        //             //     <p><strong>Rating:</strong> ${place.rating || 'N/A'}</p>
        //             //     <p><strong>Opening Hours:</strong> ${place.opening_hours || 'N/A'}</p>

        //             // `;
        //             // li.appendChild(details);

        //             // Build details HTML dynamically based on available data
        //             let detailsHtml = '';

        //             if (place.photos && place.photos.length > 0) {
        //                 detailsHtml += `<p></p>
        //                 <img src="${place.photos[0].photo_url}" alt="${place.name}" style="width: 300px;"/>`;
        //             }
        //             if (place.address) {
        //                 detailsHtml += `<p><strong>Address:</strong> ${place.address}</p>`;
        //             }
        //             if (place.phone_number) {
        //                 detailsHtml += `<p><strong>Phone number:</strong> ${place.phone_number}</p>`;
        //             }
        //             if (place.website) {
        //                 detailsHtml += `<p><strong>Website:</strong> ${place.website}</p>`;
        //             }
        //             if (place.rating) {
        //                 detailsHtml += `<p><strong>Rating:</strong> ${place.rating}</p>`;
        //             }
        //             if (place.acessibility) {
        //                 detailsHtml += `<p><strong>Acessibility:</strong> ${place.acessibility}</p>`;
        //             }
        //             if (place.opening_hours && place.opening_hours.length > 0) {
        //                 detailsHtml += `<p><strong>Opening Hours:</strong> ${place.opening_hours.join(', ')}</p>`;
        //             }



        //             // If no details were added, display a fallback message
        //             if (detailsHtml === '') {
        //                 detailsHtml = '<p>No additional information available.</p>';
        //             }

        //             details.innerHTML = detailsHtml;
        //             li.appendChild(details);
        //         }
        //     });

        //     ul.appendChild(li);
        // });

        resultsDiv.appendChild(ul);

        // Load the map module and call addMarkersToMap

        // const mapModule = await loadMapModule(result);
        // mapModule.addMarkersToMap(result);

        // Get sarting point's latitude and longitude from the submitted information => set defult position on this infos
        const latitude = parseFloat(formData.get('latitude'));
        const longitude = parseFloat(formData.get('longitude'));;
        console.log(`220 line latitude: ${latitude}`, `longitude ${longitude}`);
        // const firstResult = result[0]

        // console.log('firstResult:', firstResult.name, 'Latitude:', firstResult.location.lat, 'Longitude:', firstResult.location.lng);
        // const defaultPosition = { lat: firstResult.location.lat, lng: firstResult.location.lng };
        const defaultPosition = { lat: latitude, lng: longitude };

        const map = new google.maps.Map(document.getElementById('map'), {
            center: defaultPosition,
            zoom: 14
        });

        new google.maps.Marker({
            position: defaultPosition, // Use the extracted lat and lng
            map: map,
            title: "You are here",
            // icon: {
            //     url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon
            // }
        });

        // move out of iteration over each result to not redue it
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true, preserveViewport: true });

        let markers = [];

        result.forEach(place => {

            //MARKERS SET
            const { lat, lng } = place.location; // Extract lat and lng from place.location

            console.log('Place Map Location:', place.name, 'Latitude:', lat, 'Longitude:', lng);

            // add blue markers to result's positions
            let blueMarker = new google.maps.Marker({
                position: { lat, lng }, // Use the extracted lat and lng
                map: map,
                title: place.name,
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon
                }
            });

            markers.push(blueMarker);

            blueMarker.addListener('click', (event) => {
                console.log('blueMarkers clicked');
                // trigger the li event listener using js and the id
                const li = document.getElementById("id" + lat + "-" + lng);
                const clickEvent = new Event('click');  // Create a click event
                li.dispatchEvent(clickEvent);

            });

            //LI SETTING
            const li = document.createElement('li');
            li.textContent = `${place.name}`;
            li.style.cursor = 'pointer';
            //const { lat, lng } = place.location;
            li.setAttribute("id", "id" + lat + "-" + lng); // Set the id to each list together with the lat and lng attributes (blue markers)


            // Attach an event listener to display more information on click, but only display detail if is not null
            li.addEventListener('click', () => {
                let isOpen = false;

                if (li.getElementsByClassName('details').length) {
                    isOpen = true;
                }

                // Toggle the display of additional information

                // Hide all details elements
                ul.querySelectorAll('.details').forEach(detailsDiv => detailsDiv.remove())
                // Reset markers
                markers.forEach(
                    (marker) => {
                        marker.setIcon({
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: new google.maps.Size(32, 32)
                        });
                    }

                )

                directionsRenderer.setMap(null);

                // guard clause
                if (isOpen) return;

                // Add details elements to the clicked li
                const details = document.createElement('div');
                details.className = 'details';

                // details.innerHTML = `
                //     <p><strong>Address:</strong> ${place.address || 'N/A'}</p>
                //     <p><strong>Rating:</strong> ${place.rating || 'N/A'}</p>
                //     <p><strong>Opening Hours:</strong> ${place.opening_hours || 'N/A'}</p>

                // `;
                // li.appendChild(details);

                // Build details HTML dynamically based on available data
                let detailsHtml = '';

                if (place.photos && place.photos.length > 0) {
                    detailsHtml += `<p></p>
                        <img src="${place.photos[0].photo_url}" alt="${place.name}" style="width: 300px;"/>`;
                }
                if (place.address) {
                    detailsHtml += `<p><strong>Address:</strong> ${place.address}</p>`;
                }
                if (place.phone_number) {
                    detailsHtml += `<p><strong>Phone number:</strong> ${place.phone_number}</p>`;
                }
                if (place.website) {
                    detailsHtml += `<p><strong>Website:</strong> ${place.website}</p>`;
                }
                if (place.rating) {
                    detailsHtml += `<p><strong>Rating:</strong> ${place.rating}</p>`;
                }
                if (place.acessibility) {
                    detailsHtml += `<p><strong>Acessibility:</strong> ${place.acessibility}</p>`;
                }
                if (place.opening_hours && place.opening_hours.length > 0) {
                    detailsHtml += `<p><strong>Opening Hours:</strong> ${place.opening_hours.join(', ')}</p>`;
                }

                // If no details were added, display a fallback message
                if (detailsHtml === '') {
                    detailsHtml = '<p>No additional information available.</p>';
                }

                details.innerHTML = detailsHtml;
                li.appendChild(details);

                blueMarker.setIcon({
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    scaledSize: new google.maps.Size(32, 32)
                });

                // const activeMarker = blueMarkers.getIcon();
                // if (activeMarker.url.includes('blue-dot.png')) {
                //     console.log('if blue make green');

                //     // blueMarkers = new google.maps.Marker({
                //     //     position: { lat, lng }, // Use the extracted lat and lng
                //     //     map: map,
                //     //     title: place.name,
                //     //     icon: {
                //     //         url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" // Blue marker icon
                //     //     }
                //     // });
                // } else {
                //     console.log('if green make it blue');
                //     // blueMarkers = new google.maps.Marker({
                //     //     position: { lat, lng }, // Use the extracted lat and lng
                //     //     map: map,
                //     //     title: place.name,
                //     //     icon: {
                //     //         url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon
                //     //     }
                //     // });
                //     blueMarkers.setIcon({
                //         url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                //         scaledSize: new google.maps.Size(32, 32)
                //     });
                // }

                // if (!navigator.geolocation) return;

                // // if (navigator.geolocation) {
                // navigator.geolocation.getCurrentPosition(
                //     (position) => {
                // const originLat = position.coords.latitude;
                // const originLng = position.coords.longitude;
                // let destinationLat = ;
                // let destinationLng = ;



                const request = {
                    origin: defaultPosition,
                    destination: { lat, lng },
                    travelMode: google.maps.TravelMode.WALKING,
                };

                directionsService.route(request, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);
                        directionsRenderer.setMap(map);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                });
                // },
                //     (error) => {
                //         console.error("Error getting user location:", error.message);
                //         alert("Unable to retrieve your location. Please check your settings.");
                //     }
                // );
                // }
            });

            ul.appendChild(li);


        });

        // const directionsService = new google.maps.DirectionsService();
        // const directionsRenderer = new google.maps.DirectionsRenderer();

        // directionsRenderer.setMap(map);

        // const request = {
        //   origin: "Chicago, IL",
        //   destination: "St. Louis, MO",
        //   travelMode: google.maps.TravelMode.DRIVING,
        // };

        // directionsService.route(request, (result, status) => {
        //   if (status === google.maps.DirectionsStatus.OK) {
        //     directionsRenderer.setDirections(result);
        //   } else {
        //     console.error(`Error fetching directions: ${status}`);
        //   }
        // });

        // google.maps.event.addListener(window, 'load', () => {
        //     console.log('google.maps.event.addDomListener');
        // });


        // google.maps.event.addListener(marker, 'click', function() {window.location.href = marker.url;});


    } catch (error) {
        console.error('Error:', error);
        // Display an error message to the user
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `<p>${error.message}. Please try again or adjust your search criteria.</p>`;
    }
}

function toggleListItems(place) {

    // Toggle the display of additional information
    const detailsDiv = li.querySelector('.details');
    if (detailsDiv) {
        // Off
        detailsDiv.remove();
    } else {
        // On
        const details = document.createElement('div');
        details.className = 'details';

        // details.innerHTML = `
        //     <p><strong>Address:</strong> ${place.address || 'N/A'}</p>
        //     <p><strong>Rating:</strong> ${place.rating || 'N/A'}</p>
        //     <p><strong>Opening Hours:</strong> ${place.opening_hours || 'N/A'}</p>

        // `;
        // li.appendChild(details);

        // Build details HTML dynamically based on available data
        let detailsHtml = '';

        if (place.photos && place.photos.length > 0) {
            detailsHtml += `<p></p>
            <img src="${place.photos[0].photo_url}" alt="${place.name}" style="width: 300px;"/>`;
        }
        if (place.address) {
            detailsHtml += `<p><strong>Address:</strong> ${place.address}</p>`;
        }
        if (place.phone_number) {
            detailsHtml += `<p><strong>Phone number:</strong> ${place.phone_number}</p>`;
        }
        if (place.website) {
            detailsHtml += `<p><strong>Website:</strong> ${place.website}</p>`;
        }
        if (place.rating) {
            detailsHtml += `<p><strong>Rating:</strong> ${place.rating}</p>`;
        }
        if (place.acessibility) {
            detailsHtml += `<p><strong>Acessibility:</strong> ${place.acessibility}</p>`;
        }
        if (place.opening_hours && place.opening_hours.length > 0) {
            detailsHtml += `<p><strong>Opening Hours:</strong> ${place.opening_hours.join(', ')}</p>`;
        }



        // If no details were added, display a fallback message
        if (detailsHtml === '') {
            detailsHtml = '<p>No additional information available.</p>';
        }

        details.innerHTML = detailsHtml;
        li.appendChild(details);
    }
}
