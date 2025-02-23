// Import the Express framework for building web applications
const express = require('express');
// Create an Express application instance
const app = express();
// Import the path module to work with file and directory paths
const path = require('path');
// Import body-parser to parse incoming request bodies
const bodyParser = require('body-parser');
const axios = require('axios');
const MyMap = require('./my-map.js');
const myMapObject = new MyMap(process.env.Google_MAP_API_KEY);
// Load environment variables from a .env file into process.env
require("dotenv").config(); 
// Define the port to run the server on, defaulting to 4000 if not specified
const PORT = process.env.PORT || 4000; 
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAP_API_KEY;

// Middleware
// Use body-parser to parse JSON bodies of incoming requests
app.use(bodyParser.json());

// Serve static files from the 'public' directory
// Use static server to serve the Express Yourself Website
app.use(express.static('public')); 

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
    // Log a message to the console indicating that the server is running and on which port
    console.log(`Server is listening on ${PORT}`);
});

// Route to handle GET requests to the root URL ('/')
app.get('/', function(req, res) {
    // Send the index.html file located in the 'public' directory as the response
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//OBJECT ORIENTED PROGRAMMING
//CLASS MyMap
//function - getAPIKEY
//function suggestionOfPlaces
//const myMapObject = new MyMap()

// Endpoint to get the Google API key
app.get('/api-keys/google', (req, res) => {
    res.json({
        googleApiKey: GOOGLE_MAPS_API_KEY
    });
});

// app.post('/submittedLocation', (req, res) => {
//     fetch(`http://localhost:${PORT}/suggestionOfPlaces`, {
//         method: 'POST', 
//         headers: {'Content-Type': 'application/json'}, 
//         body: 
//         // Need to transform my object into a JSON string here, so the api can recieve it. Then transform back in the backend.
//         JSON.stringify({
//             startLocation: formData.get('YourLocation'),
//         })
//     }).then(result => {
//         return res.json(result)
//     })
// })

// To hide port number
// app.post('/submittedLocation', (req, res) => {
//     fetch(`http://localhost:${PORT}/suggestionOfPlaces`, {
//         method: 'POST', 
//         headers: {'Content-Type': 'application/json'}, 
//         body: JSON.stringify({
//             typeOfPlace: req.params.typeOfPlace,
//             startLocation: req.body.startLocation,
//             latitude: req.body.latitude,
//             longitude: req.body.longitude,
//             radious: req.body.radious
//         })
//     }).then(result => result.json())
//       .then(data => {
//           return res.json(data);
//       })
//       .catch(error => {
//           console.error('Error:', error);
//           res.status(500).json({ error: 'Internal Server Error' });
//       });
// })

// Endpoint to get the OpenAPI key
app.get('/api-keys/openapi', (req, res) => {
    res.json({
        openApiKey: process.env.OpenAPI_KEY,
    });
});



// // OpenAI API call
// const fetchOpenAIData = async (location) => {
//     const apiKey = process.env.OPENAI_API_KEY;  // Ensure you have this variable in your .env file

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${apiKey}`,
//             },
//             body: JSON.stringify({
//                 model: 'gpt-3.5-turbo',
//                 messages: [{ role: 'user', content: `Suggest 10 places near ${location} with their latitude, longitude, and a brief description.` }],
//                 temperature: 0.7,
//                 max_tokens: 500,  // Adjust the token limit as necessary
//             }),
//         });

//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
//         const data = await response.json();
//         return data.choices[0].message.content;
//     } catch (error) {
//         console.error("Error fetching data from OpenAI:", error);
//         return [];
//     }
// };

// // Handle the form submission and respond with place suggestions
// app.post('/suggestionOfPlaces', async (req, res) => {
//     const location = req.body.location;
//     console.log(`Received location: ${location}`);
    
//     const openAIResponse = await fetchOpenAIData(location);

//     // Assuming the OpenAI response is a JSON string with an array of places
//     try {
//         const places = JSON.parse(openAIResponse);
//         res.json(places);
//     } catch (error) {
//         console.error('Error parsing OpenAI response:', error);
//         res.status(500).json({ error: 'Failed to parse response from OpenAI' });
//     }
// });




// Here I recive the data
app.post('/suggestionOfPlaces', async function(req, res){
    let typeOfPlace = req.body.typeOfPlace;
    let startLocation = req.body.startLocation;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    // Get the radius from the request body (in kilometers)
    const radiusInKm = parseFloat(req.body.radius);
    // Check if the radius is a valid number and greater than 0
    if (isNaN(radiusInKm) || radiusInKm < 0) {
        return res.status(400).json({ error: 'Invalid radius value' });
    }

    // Convert the radius to meters
    const radiusInMeters = radiusInKm * 1000;

    // Log or use the radiusInMeters as needed
    console.log(`Radius in meters: ${radiusInMeters}`);
    console.log(`Recieved typeOfPlace : ${typeOfPlace}`);
    console.log(`Received startLocation: ${startLocation}`);
    console.log(`Received latitude: ${latitude}`);
    console.log(`Received longitude: ${longitude}`);
   
    
    // let type;
    
    // Handle multiple types of place
    // if (typeOfPlace === 'green') {
    //     type = ['park'].join(',');
    // } else if (typeOfPlace === 'tourist_attraction') {
    //     type = ['tourist_attraction', 'point_of_interest'].join(',');
    // } else {
    //     type = typeOfPlace;
    // }

    try {
        // console.log(`Received type: ${type}`);

        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${latitude},${longitude}`,
                radius: radiusInMeters,
                type: typeOfPlace,
                key: GOOGLE_MAPS_API_KEY
            }
        });

        // if (response.data.status !== 'OK') {
        //     throw new Error(response.data.error_message || 'Failed to fetch places');
        // }
        if (response.data.status !== 'OK') {
            return res.status(500).json({ error: response.data.error_message || 'Failed to fetch places' });
        }

     
        const places = response.data.results.slice(0, 2).map(place => ({
            name: place.name,
            address: place.vicinity,
            location: place.geometry.location,
            place_id: place.place_id
        }));

        if (places.length === 0) {
            // If the `places` array is empty, send a custom error message
            return res.status(404).json({ error: 'No places found within the specified radius. Try increasing the distance and search again.' });
        }

          // Log each place's details
          places.forEach(place => {
            console.log(`Name: ${place.name}`);
            console.log(`Address: ${place.address}`);
            console.log(`Location: Latitude: ${place.location.lat}, Longitude: ${place.location.lng}`);
            console.log(`Place ID: ${place.place_id}`);
            console.log('---'); // Separator for readability
        });

        const detailedPlaces = await Promise.all(places.map(async place => {
            const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
                params: {
                    place_id: place.place_id,
                    fields: 'name,wheelchair_accessible_entrance,website,international_phone_number,rating,formatted_address,geometry,opening_hours,photos',
                    key: GOOGLE_MAPS_API_KEY
                }
            });

            // Postman with Place(NEW) which was wrong url
            // const detailsResponse = await axios.get(`https://places.googleapis.com/v1/places/${place.place_id}?fields=id,displayName,websiteUri,accessibilityOptions,formattedAddress,location,nationalPhoneNumber,rating,regularOpeningHours`, {
            //     headers: {
            //         "Content-Type": "application/json",
            //         "Authorization": `Bearer ${GOOGLE_MAPS_API_KEY}`
            //     },
            //     params: {
            //         fields: 'id,displayName,websiteUri,accessibilityOptions,formattedAddress,location,nationalPhoneNumber,rating,regularOpeningHours'
            //     }
            // });
            // const detailsResponse = await axios.get(`https://places.googleapis.com/v1/places/${place.place_id}?fields=id,displayName,websiteUri,accessibilityOptions,formattedAddress,location,nationalPhoneNumber,rating,regularOpeningHours,photos&key=${GOOGLE_MAPS_API_KEY}`, { 
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            //         "X-Goog-FieldMask": "id,displayName,websiteUri,accessibilityOptions"
            //     }
            // });
            // const detailsResponse = await axios.get(`https://places.googleapis.com/v1/places/${place.place_id}?fields=id,displayName,websiteUri,accessibilityOptions,formattedAddress,location,nationalPhoneNumber,rating,regularOpeningHours&key=`, {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            //         "X-Goog-FieldMask": "id,displayName,websiteUri,accessibilityOptions"
            //     },
            //     params: {
            //         fields: 'id,displayName,websiteUri,accessibilityOptions,formattedAddress,location,nationalPhoneNumber,rating,regularOpeningHours'
            //     }
            // });

            if (detailsResponse.data.status !== 'OK') {
                throw new Error(detailsResponse.data.error_message || 'Failed to fetch place details');
            }

            const details = detailsResponse.data.result;
            console.log(`details: ${details}`);

          

            return {
                // id: details.id,
                // name: details.displayName,
                // website: details.websiteUri,
                // accessibilityOptions: details.accessibilityOptions,
                // address: details.formattedAddress,
                // location: details.location,
                // phone: details.nationalPhoneNumber,
                // rating: details.rating,
                // opening_hours: details.regularOpeningHours,

                name: details.name,
                address: details.formatted_address,
                location: details.geometry.location,
                website: details.website,
                phone_number: details.international_phone_number,
                acessibility: details.wheelchair_accessible_entrance ? "Yes" : "No",
                rating: details.rating,
                opening_hours: details.opening_hours ? details.opening_hours.weekday_text : null,
                photos: details.photos ? details.photos.map(photo => ({
                    photo_url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
                    attributions: photo.html_attributions
                })) : []
            };
        }));

        res.json(detailedPlaces);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// I need to do here an OPENAPI call here to get the suggestion of places based on the location provided.
//     const response = [{location: '1'}, {location: '2'}, {location: '3'}]
//     // Then here I send the response back to the client.
//     res.json(response);
// });

// app.post('/suggestionOfPlaces', async function(req, res) {
//     let startLocation = req.body;
//     console.log(startLocation);

//     try {
//         const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
//             params: {
//                 location: startLocation,
//                 radius: 5000,
//                 type: 'tourist_attraction',
//                 key: GOOGLE_MAPS_API_KEY
//             }
//         });

//         if (response.data.status !== 'OK') {
//             throw new Error(response.data.error_message || 'Failed to fetch places');
//         }

//         const places = response.data.results.slice(0, 10).map(place => ({
//             name: place.name,
//             address: place.vicinity,
//             location: place.geometry.location,
//             place_id: place.place_id
//         }));

//         const detailedPlaces = await Promise.all(places.map(async place => {
//             const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
//                 params: {
//                     place_id: place.place_id,
//                     fields: 'name,rating,formatted_address,geometry,opening_hours,photos',
//                     key: GOOGLE_MAPS_API_KEY
//                 }
//             });

//             if (detailsResponse.data.status !== 'OK') {
//                 throw new Error(detailsResponse.data.error_message || 'Failed to fetch place details');
//             }

//             const details = detailsResponse.data.result;

//             return {
//                 name: details.name,
//                 address: details.formatted_address,
//                 location: details.geometry.location,
//                 rating: details.rating,
//                 opening_hours: details.opening_hours ? details.opening_hours.weekday_text : null,
//                 photos: details.photos ? details.photos.map(photo => ({
//                     photo_url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`,
//                     attributions: photo.html_attributions
//                 })) : []
//             };
//         }));

//         res.json(detailedPlaces);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });