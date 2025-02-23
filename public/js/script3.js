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
        // Fetch the data from the server
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
            console.log(`Place ${index + 1}:`, place);
        });
        
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
        
        resultsDiv.appendChild(ul);
        
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

        // Declare active marker for color toggling
        let activeMarker = null;
        
        result.forEach(place => {
            
            //MARKERS SET
            const { lat, lng } = place.location; // Extract lat and lng from place.location
            
            console.log('Place Map Location:', place.name, 'Latitude:', lat, 'Longitude:', lng);
            
            // add blue markers to result's positions
            let blueMarkers = new google.maps.Marker({
                position: { lat, lng }, // Use the extracted lat and lng
                map: map,
                title: place.name,
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon
                }
            });
            
            blueMarkers.addListener('click', (event) => {
                if(activeMarker){
                    // Reset the icon of the previous active marker to blue
                    activeMarker.setIcon({
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: new google.maps.Size(32, 32)
                    });
                }

                // Change the clicked marker's icon to green
                blueMarker.setIcon({
                    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    scaledSize: new google.maps.Size(32, 32)
                });
                
                activeMarker = blueMarker;

                // console.log('blueMarkers clicked');
                // // trigger the li event listener using js and the id
                // const li = document.getElementById("id" + lat + "-"+ lng);
                // const clickEvent = new Event('click');  // Create a click event
                // li.dispatchEvent(clickEvent);

                // Now, calculate the route using the current user's location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const originLat = position.coords.latitude;
                            const originLng = position.coords.longitude;
                            
                            const directionsService = new google.maps.DirectionsService();
                            const directionsRenderer = new google.maps.DirectionsRenderer();
                            
                            directionsRenderer.setMap(map);
                            
                            const request = {
                                origin: {lat: originLat, lng: originLng},
                                destination: {lat, lng},
                                travelMode: google.maps.TravelMode.DRIVING,
                            };
                            
                            directionsService.route(request, (result, status) => {
                                if (status === google.maps.DirectionsStatus.OK) {
                                    directionsRenderer.setDirections(result);
                                } else {
                                    console.error(`Error fetching directions: ${status}`);
                                }
                            });
                        },
                        (error) => {
                            console.error("Error getting user location:", error.message);
                            alert("Unable to retrieve your location. Please check your settings.");
                        }
                    );
                }
                
            });
            
            //LI SETTING
            const li = document.createElement('li');
            li.textContent = `${place.name}`;
            li.style.cursor = 'pointer';
            //const { lat, lng } = place.location;
            li.setAttribute("id", "id" + lat + "-" + lng); // Set the id to each list together with the lat and lng attributes (blue markers)
            
            
            // Attach an event listener to display more information on click, but only display detail if is not null
            li.addEventListener('click', () => {
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
                
                // const activeMarker = blueMarkers.getIcon();
                // if(activeMarker.url.includes('blue-dot.png')) {
                //     console.log('if blue make green');
                //     blueMarkers.setIcon({
                //         url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                //         scaledSize: new google.maps.Size(32, 32)
                //     });
                  
                // } else {
                //     console.log('if green make it blue');
                  
                //     blueMarkers.setIcon({
                //         url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                //         scaledSize: new google.maps.Size(32, 32)
                //     });
                // }
                
                // if (navigator.geolocation) {
                //     navigator.geolocation.getCurrentPosition(
                //         (position) => {
                //             const originLat = position.coords.latitude;
                //             const originLng = position.coords.longitude;
                            
                //             const directionsService = new google.maps.DirectionsService();
                //             const directionsRenderer = new google.maps.DirectionsRenderer();
                            
                //             directionsRenderer.setMap(map);
                            
                //             const request = {
                //                 origin: {lat: originLat, lng: originLng},
                //                 destination: {lat, lng},
                //                 travelMode: google.maps.TravelMode.DRIVING,
                //             };
                            
                //             directionsService.route(request, (result, status) => {
                //                 if (status === google.maps.DirectionsStatus.OK) {
                //                     directionsRenderer.setDirections(result);
                //                 } else {
                //                     console.error(`Error fetching directions: ${status}`);
                //                 }
                //             });
                //         },
                //         (error) => {
                //             console.error("Error getting user location:", error.message);
                //             alert("Unable to retrieve your location. Please check your settings.");
                //         }
                //     );
                // } 
            });
            
            ul.appendChild(li);
            
            
        });
                
        
    } catch (error) {
        console.error('Error:', error);
        // Display an error message to the user
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `<p>${error.message}. Please try again or adjust your search criteria.</p>`;
    }
}

function toggleListItems(place){
    
    // Toggle the display of additional information
    const detailsDiv = li.querySelector('.details');
    if (detailsDiv) {
        // Off
        detailsDiv.remove();
    } else {
        // On
        const details = document.createElement('div');
        details.className = 'details';
        
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
