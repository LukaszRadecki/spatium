# Spatium

![Spatium](https://github.com/LukaszRadecki/spatium/blob/readme_and_docs/spatium_logo.jpg)

Spatium it's a simple jQuery plugin that is used to search for a location within a radius distance.

### Demo:

![https://codepen.io/lukaszRadecki/full/bjMmXP/]

## Requirements

To start working with Spatium right away, you have to include some libs to your project:

```html
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
```


## Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
initLocation | string / object | false | Location that will be selected, before you search.
initZoom | integer | false | Init number of zoom, or `false`. (After searching zoom is automatically fit to found markers).
initLocationInfoWindow | string / boolean | false| Content of init location Info Window, or `false` if you don't want to display it.
mapOptions | object | {} | Object of map settings - color scheme etc.
inputLocation | string / object | false | Location around which to search.
locationsSet | string / object | {} | Object with locations set, or path to a `json` file. Single location object must contain `lat` and `lng` parameters.
radius | integer | 0 | Radius distance value.
distanceUnit | string | "km" | Unit of radius distance.
locationsMarkers | string / boolean | false | Path to markers icon file (`*.jpg`/`*.png`), or `false` if you don't want to display it.
infoWindowTemplate | object / boolean | false| Object of Info Window template or `false`, if you don't want to display it.
mainLocationMarker | string / boolean | false | Path to markers icon file (`*.jpg`/`*.png`), or `false` if you don't want to display it.
mainMarkerDraggable | boolean | true | Draggable of main location marker - if you set `true`, you can searching locations by drag & drop main marker.
mainLocationInfoWindow | string | start | Content of main location Info Window, or `false` if you don't want to display it.


## Events

Event | Params | Description
----- | ------ | -----------
spatium.mapRenderDone | `event`, `markersObject` | After locations search callback, return `event` and object of found locations with `distance` extra parameter.

#### Example usage:

```javascript

$("#map").on('spatium.mapRenderDone', function(event, locationsObj){
        
    console.dir(locationsObj);
        
});

```

## Methods

Method | Argument | Description
------ | -------- | -----------
`spatium` | options: object | Init method.
`updateData` | options: object | Update options and search locations.
`getMatchedLocations` | order: string, orderBy: string | Get matched locations method. Avaliable only after locations search, include basic sort options.
`destroy` |  | Remove map and destroy Spatium in document scope.


#### Example usage:

###### spatium

```javascript

$('#map').spatium({
    inputLocation: "London",
    locationsSet: "./js/locations.json",
    radius: 100,
    distanceUnit: "mi",
    locationsMarkup: "./img/marker.png",
    mainLocationMarkup: "./img/marker-main.png",
    infoWindowTemplate: [
          {
            tag: "h2",
            content: "company", // my dataset contain `company` param
            class: "your-class"
          },
          {
            tag: "p",
            content: "Some plain text",
          },
          {
            tag: "a",
            url: "email", // my dataset contain `email` param
            target: "_blank",
            content: "name", // my dataset contain `name` param
            class: ""
          },
          {
            tag: "p",
            content: "distance",
            class: "your-class"
          },
        ]
});

```

###### updateData

```javascript

// Get values from form fields:

$('#map').spatium('updateData', {
    inputLocation: $('#inputLocation').val(),
    radius: $('#radius').val()
});

```

###### getMatchedLocations

```javascript

// Get matched locations object, and sort DESC by `distance` parameter:

$('#map').spatium('getMatchedLocations', 'DESC', 'distance');

```

###### destroy

```javascript

$('#map').spatium('destroy');

```