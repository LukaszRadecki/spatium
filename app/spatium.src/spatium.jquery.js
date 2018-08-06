/*!
 * jQuery UI Widget-factory plugin
 * Author: Lukasz Radecki
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

  $.widget( "sptm.spatium" , {
    

      //Options to be used as defaults
      options: {
        initLocation: "", // String with name or coordinates
        initZoom: 10, // Number only
        initLocationInfoWindow: false,
        mapOptions: {}, // Settings object
        inputLocation: "", // String with name or coordinates
        locationsSet: {}, // Object with Lat, Lng or path to json (string or array with objects)
        radius: "", // only number
        distanceUnit: "km", //km or mi
        locationsMarker: "", // path to icon file
        markersAnimation: false,
        infoWindowTemplate: [
          {
            tag: "h2",
            content: "company",
            class: "klasa"
          },
          {
            tag: "p",
            content: "address",
            class: "klasa"
          },
          {
            tag: "a",
            url: "email",
            target: "_blank",
            content: "email",
            class: ""
          },
          {
            tag: "p",
            content: "distance",
            class: ""
          },
        ], // tpl object
        mainLocationMarker: true,
        mainLocationDraggable: true, // path to icon file or false
        mainLocationInfoWindow: false // string or false
      },

      matchedLocations: [],

      mapObject: {},

      markersArr: [],

      // Private methods:

      _create: function () {

        this._mapCreate();

        if (this.options.locationsSet && this.options.inputLocation) {
          this._searchLocations();
        }else if(this.options.initLocation){
          this._singleLocationRender();
        }else{
          console.error("Spatium: Set 'initLocation' or 'inputLocation' and 'locationsSet' parameters.");
        }
      },

      _mapCreate: function(){
        let map = new google.maps.Map(this.element[0], this.options.mapOptions);
        return this.mapObject = map;
      },

      _loadJSON: function(jsonPath) {
        return new Promise(resolve => {
          $.getJSON(jsonPath, function(json) {
            resolve(json);
          });
        });
      },

      _geoEncode: function(locationInput){
        let geocoder = new google.maps.Geocoder();
        if (typeof locationInput == "string") {
          return new Promise(resolve => {
            geocoder.geocode( { 'address': locationInput}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                let obj = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                }
                  resolve(obj);
              }else{
                console.error("Spatium: Invalid location name - coordinates encoding error.");
                console.error(status);
              }
            });
          });
        }else if(typeof locationInput == "object"){
          return locationInput;
        }else{
          console.error("Spatium: Input value type error.")
        }
        
      },

      _rad: function(x){
        return x * Math.PI / 180;
      },

      _templateEngine: function(data){
        let outputTpl = '';
        let tpl = this.options.infoWindowTemplate;

        tpl.forEach(element => {
          outputTpl +=  '<'+element.tag+' class="'+element.class+'"'+
                        (element.url ? ' href="'+data[element.url]+'"' : '' )+
                        (element.target && element.url ? ' target="'+element.target+'"' : '' )+
                        '>'+
                        (data[element.content] ? data[element.content] : element.content)+
                        '</'+element.tag+'>';
        });

        return outputTpl;
      },

      _singleLocationRender: function(){

        let _ = this;
        let singleArr = [];

        this._geoEncode(_.options.initLocation).then(function(value){

          singleArr.push(value)
          
          _._drawMarkups(singleArr);
        })

      },

      _searchLocations: function(){

        let _ = this;

        Promise.all([this._geoEncode(_.options.inputLocation), this._loadJSON(_.options.locationsSet)]).then(function(values){
          let originLocation = values[0];
          let locations = values[1];

          let matchLocations = locations;
          let R = 6378137; // Earth’s mean radius in meter
          let distanceConverter;
  
          switch(_.options.distanceUnit.toLowerCase()) {
            case "mi":
              distanceConverter = 1609.344;
                break;
            default:
              distanceConverter = 1000;
          }
  
          for (let i = 0; i < locations.length; i++) {
            
            let dLat = _._rad(locations[i].lat - originLocation.lat);
            let dLong = _._rad(locations[i].lng - originLocation.lng);
            let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(_._rad(originLocation.lat)) * Math.cos(_._rad(locations[i].lat)) *
              Math.sin(dLong / 2) * Math.sin(dLong / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let distance = R * c;
            let convertedDistance = Math.round(distance/distanceConverter * 10) / 10;
  
            if (convertedDistance <= _.options.radius || !_.options.radius || _.options.radius == "") {
              matchLocations[i].distance = convertedDistance;
            }else{
              matchLocations.splice(i, 1);
              i--;
            }
          }
          
          _.matchedLocations = matchLocations;
          
          
          if (matchLocations.length > 0) {
            _.element.trigger("spatium.mapRenderDone", [{status: 1, message:"Locations found", data: _.matchedLocations}]);
            _._drawMarkups(matchLocations, originLocation);
          }else{
            _.element.trigger("spatium.mapRenderDone", [{status: 0, message:"Nothing found", data: false}]);
          }
          
        })
      },
  
      _drawMarkups: function(markers, originLocation){
          
          let _ = this;
          let bounds = new google.maps.LatLngBounds();
          let infowindow = new google.maps.InfoWindow();
          
          let openedWindow;

          for (var i = 0; i < _.markersArr.length; i++ ) {
            _.markersArr[i].setMap(null);
          }
          _.markersArr = [];
          
          for (let i = 0; i < markers.length; i++) {
            
            let position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
            bounds.extend(position);
            let marker = new google.maps.Marker({
                position: position,
                map: _.mapObject,
                icon: _.options.locationsMarker,
                animation: (_.options.markersAnimation ? google.maps.Animation.DROP : false)
            });

            _.markersArr.push(marker);

            infowindow = new google.maps.InfoWindow();

            google.maps.event.addListener(marker, "click", function () {
              if(openedWindow){
                openedWindow.close();
              }
              if (markers.length > 1) {
                infowindow.setContent(_._templateEngine(markers[i]));
              }else{
                infowindow.setContent((_.options.initLocationInfoWindow ? _.options.initLocationInfoWindow : _.options.initLocation ));
              }
              
              infowindow.open(_.mapObject, this);
              openedWindow = infowindow;
            });

            if (markers.length == 1) {
              google.maps.event.addListener(_.mapObject, 'zoom_changed', function() {
                let zoomChangeBoundsListener = 
                    google.maps.event.addListener(_.mapObject, 'bounds_changed', function(event) {
                        if (this.getZoom() > _.options.initZoom && this.initialZoom == true) {
                            this.setZoom(_.options.initZoom);
                            this.initialZoom = false;
                        }
                    google.maps.event.removeListener(zoomChangeBoundsListener);
                });
              });
            }

          }

          if (_.options.mainLocationMarker) {
            let marker = new google.maps.Marker({
                position: originLocation,
                title: 'Main Location',
                draggable: _.options.mainLocationDraggable,
                map: _.mapObject,
                icon: _.options.mainLocationMarker
            });

            _.mapObject.setCenter(marker.getPosition());

            google.maps.event.addListener(marker, "click", function () {
              if(openedWindow){
                openedWindow.close();
              }
              
              infowindow.setContent((_.options.mainLocationInfoWindow ? _.options.mainLocationInfoWindow : _.options.initLocation ));
              
              infowindow.open(_.mapObject, this);
              openedWindow = infowindow;
            });

            google.maps.event.addListener(marker, "dragend", function(event) {
              _.options.inputLocation = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              }
              
              _._searchLocations()
              
            });

            _.markersArr.push(marker);
          }

          if (markers.length > 1) {
            _.mapObject.fitBounds(bounds);
          }else{
            _.mapObject.initialZoom = true;
            _.mapObject.fitBounds(bounds);
          }
          
      },

      _compareEngine: function(param) {
        return function(a, b) {
          if (a[param] < b[param])
            return -1;
          if (a[param] > b[param])
            return 1;
          return 0;
        }
      },

      // Shader methods:

      destroy: function () {
        this.element[0].innerHTML = "";
        $.Widget.prototype.destroy.call(this);
      },

      updateData: function(updateObj){
        this.options = $.extend({}, this.options, updateObj);
        this._searchLocations();
      },

      getMatchedLocations: function(order, orderBy){

        let orderedArray = this.matchedLocations;
        
        if (orderBy) {

          if (order=="DESC") {
            orderedArray = this.matchedLocations.sort(this._compareEngine(orderBy)).reverse();
          }else{
            orderedArray = this.matchedLocations.sort(this._compareEngine(orderBy));
          }
          
        }

        return orderedArray;
      
      },

      openInfoWindow: function(){
        console.log("Feature in progress");
      }
      

  });

})( jQuery, window, document );