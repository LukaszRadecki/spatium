"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

;(function ($, window, document, undefined) {

  $.widget("sptm.spatium", {

    //Options to be used as defaults
    options: {
      initLocation: "London", // String with name or coordinates
      initZoom: 10, // Number only
      initLocationInfoWindow: "<h1>Start<h1>",
      mapOptions: {}, // Settings object
      inputLocation: "", // String with name or coordinates
      locationsSet: {}, // Object with Lat, Lng or path to json (string or array with objects)
      radius: "", // only number
      distanceUnit: "km", //km or mi
      locationsMarkup: "", // path to icon file
      infoWindowTemplate: [{
        tag: "h2",
        content: "company",
        class: "klasa"
      }, {
        tag: "p",
        content: "address",
        class: "klasa"
      }, {
        tag: "a",
        url: "email",
        target: "_blank",
        content: "email",
        class: ""
      }, {
        tag: "p",
        content: "distance",
        class: ""
      }], // tpl object
      mainLocationMarkup: "",
      mainLocationDraggable: true, // path to icon file or false
      mainLocationInfoWindow: "" // string or false
    },

    matchedLocations: {},

    _create: function _create() {

      if (this.options.locationsSet && this.options.inputLocation) {
        this._searchLocations();
      } else if (this.options.initLocation) {
        this._singleLocationRender();
      } else {
        console.error("Spatium: Set 'initLocation' or 'inputLocation' and 'locationsSet' parameters.");
      }
    },

    destroy: function destroy() {

      $.Widget.prototype.destroy.call(this);
    },

    _loadJSON: function _loadJSON(jsonPath) {
      return new Promise(function (resolve) {
        $.getJSON(jsonPath, function (json) {
          resolve(json);
        });
      });
    },

    _geoEncode: function _geoEncode(locationInput) {
      var geocoder = new google.maps.Geocoder();
      if (typeof locationInput == "string") {
        return new Promise(function (resolve) {
          geocoder.geocode({ 'address': locationInput }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              var obj = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              };
              resolve(obj);
            } else {
              console.error("Spatium: Invalid location name - coordinates encoding error.");
              console.error(status);
            }
          });
        });
      } else if ((typeof locationInput === "undefined" ? "undefined" : _typeof(locationInput)) == "object") {
        return locationInput;
      } else {
        console.error("Spatium: Input value type error.");
      }
    },

    _rad: function _rad(x) {
      return x * Math.PI / 180;
    },

    _templateEngine: function _templateEngine(data) {
      var outputTpl = '';
      var tpl = this.options.infoWindowTemplate;

      tpl.forEach(function (element) {
        outputTpl += '<' + element.tag + ' class="' + element.class + '"' + (element.url ? ' href="' + data[element.url] + '"' : '') + (element.target && element.url ? ' target="' + element.target + '"' : '') + '>' + (data[element.content] ? data[element.content] : element.content) + '</' + element.tag + '>';
      });

      return outputTpl;
    },

    _singleLocationRender: function _singleLocationRender() {

      var _ = this;
      var singleArr = [];

      this._geoEncode(_.options.initLocation).then(function (value) {

        singleArr.push(value);

        _._drawMarkups(singleArr);
      });
    },

    _searchLocations: function _searchLocations() {

      var _ = this;

      Promise.all([this._geoEncode(_.options.inputLocation), this._loadJSON(_.options.locationsSet)]).then(function (values) {
        var originLocation = values[0];
        var locations = values[1];

        var matchLocations = locations;
        var R = 6378137; // Earth’s mean radius in meter
        var distanceConverter = void 0;

        switch (_.options.distanceUnit.toLowerCase()) {
          case "mi":
            distanceConverter = 1609.344;
            break;
          default:
            distanceConverter = 1000;
        }

        for (var i = 0; i < locations.length; i++) {

          var dLat = _._rad(locations[i].lat - originLocation.lat);
          var dLong = _._rad(locations[i].lng - originLocation.lng);
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(_._rad(originLocation.lat)) * Math.cos(_._rad(locations[i].lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var distance = R * c;
          var convertedDistance = Math.round(distance / distanceConverter * 10) / 10;

          if (convertedDistance <= _.options.radius || !_.options.radius || _.options.radius == "") {
            matchLocations[i].distance = convertedDistance;
          } else {
            matchLocations.splice(i, 1);
            i--;
          }
        }

        _.matchedLocations = matchLocations;

        if (matchLocations.length > 0) {
          _.element.trigger("spatium.mapRenderDone", [{ status: 1, message: "Locations found", data: _.matchedLocations }]);
          _._drawMarkups(matchLocations, originLocation);
        } else {
          _.element.trigger("spatium.mapRenderDone", [{ status: 0, message: "Nothing found", data: false }]);
        }
      });
    },

    _drawMarkups: function _drawMarkups(markers, originLocation) {

      var _ = this;
      var bounds = new google.maps.LatLngBounds();
      var map = new google.maps.Map(_.element[0], _.options.mapOptions);
      var openedWindow = void 0;

      var _loop = function _loop(i) {

        var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
        bounds.extend(position);
        var marker = new google.maps.Marker({
          position: position,
          map: map,
          icon: _.options.locationsMarkup
        });

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, "click", function () {
          if (openedWindow) {
            openedWindow.close();
          }
          if (markers.length > 1) {
            infowindow.setContent(_._templateEngine(markers[i]));
          } else {
            infowindow.setContent(_.options.initLocationInfoWindow ? _.options.initLocationInfoWindow : _.options.initLocation);
          }

          infowindow.open(map, this);
          openedWindow = infowindow;
        });

        if (markers.length == 1) {
          google.maps.event.addListener(map, 'zoom_changed', function () {
            var zoomChangeBoundsListener = google.maps.event.addListener(map, 'bounds_changed', function (event) {
              if (this.getZoom() > _.options.initZoom && this.initialZoom == true) {
                this.setZoom(_.options.initZoom);
                this.initialZoom = false;
              }
              google.maps.event.removeListener(zoomChangeBoundsListener);
            });
          });
        }
      };

      for (var i = 0; i < markers.length; i++) {
        _loop(i);
      }

      if (_.options.mainLocationMarkup) {
        var marker = new google.maps.Marker({
          position: originLocation,
          title: 'Main Location',
          draggable: _.options.mainLocationDraggable,
          map: map,
          icon: _.options.mainLocationMarkup
        });
        map.setCenter(marker.getPosition());

        google.maps.event.addListener(marker, "dragend", function (event) {
          _.options.inputLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };

          _._searchLocations();
        });
      }

      if (markers.length > 1) {
        map.fitBounds(bounds);
      } else {
        map.initialZoom = true;
        map.fitBounds(bounds);
      }
    },

    updateData: function updateData(updateObj) {
      this.options = $.extend({}, this.options, updateObj);
      this._searchLocations();
    },

    getMatchedLocations: function getMatchedLocations(order, orderBy) {

      var orderedArray = this.matchedLocations;

      if (orderBy) {

        if (order == "DESC") {
          orderedArray = this.matchedLocations.sort(this._compareEngine(orderBy)).reverse();
        } else {
          orderedArray = this.matchedLocations.sort(this._compareEngine(orderBy));
        }
      }

      return orderedArray;
    },

    openInfoWindow: function openInfoWindow() {
      console.log("Feature in progress");
    },

    _compareEngine: function _compareEngine(param) {
      return function (a, b) {
        if (a[param] < b[param]) return -1;
        if (a[param] > b[param]) return 1;
        return 0;
      };
    }

  });
})(jQuery, window, document);