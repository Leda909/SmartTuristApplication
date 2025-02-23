async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const defaultPosition = { lat: 51.501364, lng: -0.1444649 };
    const map = new Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultPosition,
        mapId: "DEMO_MAP_ID",
    });

    // navigator.geolocation.getCurrentPosition((position) => {
    //     const currentUserPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
    //     map.setCenter(currentUserPosition);
    //     new AdvancedMarkerElement({
    //         map: map,
    //         position: currentUserPosition,
    //         title: 'You are here'
    //     });
    // });

    initAutocomplete();
}

function initAutocomplete() {
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

        const map = new google.maps.Map(document.getElementById('map'), {
            center: currentUserPosition,
            zoom: 15
        });

        new google.maps.Marker({
            position: currentUserPosition,
            map: map,
            title: 'You are here'
        });
    });
}
