$( document ).ready(function() {
    
});

function mapInit(){

    var mapSettings = {
        mapTypeId: 'roadmap',
        styles: [
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "saturation": "-100"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "color": "#545454"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "saturation": "-87"
                    },
                    {
                        "lightness": "-40"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#f0f0f0"
                    },
                    {
                        "saturation": "-22"
                    },
                    {
                        "lightness": "-16"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "saturation": "-52"
                    },
                    {
                        "hue": "#00e4ff"
                    },
                    {
                        "lightness": "-16"
                    }
                ]
            }
        ]
    };

    $('#map').spatium({
        locationsSet: "./js/locations.json",
        inputLocation: "",
        locationsMarkup: "./img/marker.png",
        mainLocationMarkup: "./img/marker-main.png",
        mapOptions: mapSettings
    });

    $('#searchLocations').on('click', function(){
        $('#map').spatium('updateData', {
            inputLocation: $('#inputLocation').val(),
            radius: $('#radius').val()
        });
    })
    
    $("#map").on('spatium.mapRenderDone', function(event, params){
        
        //console.log($('#map').spatium('getMatchedLocations', 'DESC', 'distance'));
        
    })


}