# Spatium

![Spatium](https://github.com/LukaszRadecki/spatium/blob/readme_and_docs/spatium_logo.jpg)

Spatium it's a simple jQuery plugin that is used to search for a location within a radius distance.

## Requirements

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


## Methods

Method | Argument | Description
------ | -------- | -----------
`spatium` | options: object | Init method.
`updateData` | options: object | Update options and search locations.
`getMatchedLocations` | order: string, orderBy: string | Get matched locations method. Avaliable only after locations search, include basic sort options.


#### Example usage: