function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var ReactDOM = _interopDefault(require('react-dom'));
var GoogleMapReact = _interopDefault(require('google-map-react'));
var PropTypes = _interopDefault(require('prop-types'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var styles = {"searchCityWrapper":"_2doUD","gmapsAutocomplete":"_3SaM9"};

var googleAutocomplete;

var SearchCity = function SearchCity(_ref) {
  var maps = _ref.maps,
      onPlaceChanged = _ref.onPlaceChanged;

  var _React$useState = React.useState(),
      googleMaps = _React$useState[0],
      setGoogleMaps = _React$useState[1];

  var autocompleteInput = React.useRef(null);
  React.useEffect(function () {
    if (!maps || googleMaps !== undefined || autocompleteInput.current === null) return;
    setGoogleMaps(maps);
    var options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: ["geocode"]
    };
    googleAutocomplete = new maps.places.Autocomplete(autocompleteInput.current, options);
    googleAutocomplete.addListener("place_changed", placeChanged);
  }, [maps, autocompleteInput.current]);

  function placeChanged() {
    var _googleAutocomplete$g;

    var place = (_googleAutocomplete$g = googleAutocomplete.getPlace().geometry) === null || _googleAutocomplete$g === void 0 ? void 0 : _googleAutocomplete$g.location;
    if (place === undefined) return;
    onPlaceChanged({
      lat: place.lat(),
      lng: place.lng()
    }, googleAutocomplete.getPlace().name);
  }

  return React.createElement("div", {
    className: styles.searchCityWrapper
  }, React.createElement("input", {
    type: "text",
    className: styles.gmapsAutocomplete,
    ref: autocompleteInput
  }));
};

var styles$1 = {"mapWrapper":"_2Ta6d","panelTool":"_3JwS5","deleteMenu":"_sfPTo"};

var resetButton = function resetButton(controlDiv) {
  var controlUI = document.createElement("div");
  controlUI.style.backgroundColor = "#fff";
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginLeft = "8px";
  controlUI.style.marginTop = "8px";
  controlUI.style.marginBottom = "22px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Click to reset the area";
  controlDiv.appendChild(controlUI);
  var controlText = document.createElement("div");
  controlText.style.color = "rgb(102 102 102)";
  controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  controlText.style.fontSize = "14px";
  controlText.style.lineHeight = "25px";
  controlText.style.paddingLeft = "5px";
  controlText.style.paddingRight = "5px";
  controlText.innerHTML = "Reset";
  controlUI.appendChild(controlText);
  return controlUI;
};

var GMapsPolygon;
var GMapsAPI;
var DEFAULT_OPTIONS = {
  width: '100%',
  height: '400px',
  strokeColor: '#7f101d'
};

var ReactMapsAreaSelection = function ReactMapsAreaSelection(_ref) {
  var setPolygon = function setPolygon(customPolygon) {
    if (customPolygon === void 0) {
      customPolygon = null;
    }

    try {
      var _map$getCenter;

      var _GMapsAPI2 = GMapsAPI,
          map = _GMapsAPI2.map,
          maps = _GMapsAPI2.maps;

      var _map$getCenter$toJSON = (_map$getCenter = map.getCenter()) === null || _map$getCenter === void 0 ? void 0 : _map$getCenter.toJSON(),
          lat = _map$getCenter$toJSON.lat,
          lng = _map$getCenter$toJSON.lng;

      var path = customPolygon ? customPolygon : [new maps.LatLng(lat + 0.01, lng + 0.01), new maps.LatLng(lat + 0.01, lng - 0.01), new maps.LatLng(lat - 0.01, lng - 0.01), new maps.LatLng(lat - 0.01, lng + 0.01)];
      if (GMapsPolygon) GMapsPolygon.setMap(null);
      GMapsPolygon = new maps.Polygon({
        path: path,
        editable: true,
        draggable: false,
        strokeColor: (options === null || options === void 0 ? void 0 : options.strokeColor) || DEFAULT_OPTIONS.strokeColor,
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
      });

      var DeleteMenu = /*#__PURE__*/function (_google$maps$OverlayV) {
        _inheritsLoose(DeleteMenu, _google$maps$OverlayV);

        function DeleteMenu() {
          var _this;

          _this = _google$maps$OverlayV.call(this) || this;
          _this.div_ = document.createElement("div");
          _this.div_.className = styles$1.deleteMenu;
          _this.div_.innerHTML = "Elimina";

          var menu = _assertThisInitialized(_this);

          google.maps.event.addDomListener(_this.div_, "click", function () {
            menu.removeVertex();
          });
          return _this;
        }

        var _proto = DeleteMenu.prototype;

        _proto.onAdd = function onAdd() {
          var deleteMenu = this;
          var map = this.getMap();
          this.getPanes().floatPane.appendChild(this.div_);
          this.divListener_ = google.maps.event.addDomListener(map.getDiv(), "mousedown", function (e) {
            if (e.target != deleteMenu.div_) {
              deleteMenu.close();
            }
          }, true);
        };

        _proto.onRemove = function onRemove() {
          if (this.divListener_) {
            google.maps.event.removeListener(this.divListener_);
          }

          this.div_.parentNode.removeChild(this.div_);
          this.set("position", null);
          this.set("path", null);
          this.set("vertex", null);
        };

        _proto.close = function close() {
          this.setMap(null);
        };

        _proto.draw = function draw() {
          var position = this.get("position");
          var projection = this.getProjection();

          if (!position || !projection) {
            return;
          }

          var point = projection.fromLatLngToDivPixel(position);
          this.div_.style.top = point.y + "px";
          this.div_.style.left = point.x + "px";
        };

        _proto.open = function open(map, path, vertex) {
          this.set("position", path.getAt(vertex));
          this.set("path", path);
          this.set("vertex", vertex);
          this.setMap(map);
          this.draw();
        };

        _proto.removeVertex = function removeVertex() {
          var path = this.get("path");
          var vertex = this.get("vertex");

          if (!path || vertex == undefined) {
            this.close();
            return;
          }

          path.removeAt(vertex);
          this.close();
        };

        return DeleteMenu;
      }(google.maps.OverlayView);

      var deleteMenu = new DeleteMenu();
      maps.event.addListener(GMapsPolygon, "mouseup", function (e) {
        polygonChanged();

        if (e.vertex == undefined || GMapsPolygon.getPath().getLength() < 4) {
          return true;
        }

        deleteMenu.open(map, GMapsPolygon.getPath(), e.vertex);
        return true;
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var apiKey = _ref.apiKey,
      options = _ref.options,
      polygon = _ref.polygon,
      _ref$center = _ref.center,
      center = _ref$center === void 0 ? CENTER_FOLIGNO : _ref$center,
      onChange = _ref.onChange,
      onPlaceChanged = _ref.onPlaceChanged;
  React.useMemo(function () {
    if (!GMapsAPI) return;
    setPolygon(polygon);
  }, [polygon]);

  var handleApiLoaded = function handleApiLoaded(mapObj) {
    GMapsAPI = mapObj;

    if (polygon) {
      var bounds = new google.maps.LatLngBounds();
      polygon.map(function (i) {
        return bounds.extend(i);
      });
      mapObj.map.fitBounds(bounds, 0);
      mapObj.map.setCenter(bounds.getCenter());
    }

    setPolygon(polygon);
    setCustomUI();
  };

  function setCustomUI() {
    var _GMapsAPI;

    var cityInput = document.createElement('div');
    ReactDOM.render(React.createElement(SearchCity, {
      maps: (_GMapsAPI = GMapsAPI) === null || _GMapsAPI === void 0 ? void 0 : _GMapsAPI.maps,
      onPlaceChanged: placeChanged
    }), cityInput);
    GMapsAPI.map.controls[google.maps.ControlPosition.TOP_LEFT].push(cityInput);
    var resetDiv = document.createElement("div");
    resetButton(resetDiv);
    GMapsAPI.map.controls[google.maps.ControlPosition.LEFT_TOP].push(resetDiv);
    google.maps.event.addDomListener(resetDiv, 'click', resetPolygon);
  }

  function placeChanged(newCenter, city) {
    if (!GMapsAPI) return;
    GMapsAPI.map.setCenter(newCenter);
    if (onPlaceChanged) onPlaceChanged(newCenter, city);
    setPolygon();
  }

  var resetPolygon = function resetPolygon() {
    if (!GMapsAPI) return;
    setPolygon();
    polygonChanged();
  };

  function polygonChanged() {
    onChange(getVertexPoints());
  }

  function getVertexPoints() {
    var vertices = GMapsPolygon.getPath();
    var verticiesObj = [];

    for (var i = 0; i < vertices.getLength(); i++) {
      verticiesObj.push({
        lat: vertices.getAt(i).lat(),
        lng: vertices.getAt(i).lng()
      });
    }

    return verticiesObj;
  }

  return React.createElement("div", {
    className: styles$1.mapWrapper,
    style: {
      width: (options === null || options === void 0 ? void 0 : options.width) || DEFAULT_OPTIONS.width,
      height: (options === null || options === void 0 ? void 0 : options.height) || DEFAULT_OPTIONS.height
    }
  }, React.createElement(GoogleMapReact, {
    bootstrapURLKeys: {
      key: apiKey,
      libraries: ["places", "visualization"]
    },
    defaultCenter: center,
    defaultZoom: 12,
    yesIWantToUseGoogleMapApiInternals: true,
    onGoogleApiLoaded: handleApiLoaded
  }));
};

var CENTER_FOLIGNO = {
  lat: 42.958433,
  lng: 12.709864
};
ReactMapsAreaSelection.propTypes = {
  apiKey: PropTypes.string.isRequired,
  options: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    strokeColor: PropTypes.string
  }),
  center: PropTypes.exact({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  onChange: PropTypes.func.isRequired
};

module.exports = ReactMapsAreaSelection;
//# sourceMappingURL=index.js.map
