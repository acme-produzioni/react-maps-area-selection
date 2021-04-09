import * as React from 'react';
import ReactDOM from 'react-dom';
import SearchCity from './components/SearchCity';
import GoogleMapReact from 'google-map-react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import resetButton from './gmapsUI/reset';

type GMapsAPI = {
  map: google.maps.Map, 
  maps: any
}

interface AreaSelectionOptions {
  width?: string|number,
  height?: string|number,
  strokeColor?: string,
}

interface Props {
  apiKey: string,
  onChange: (vertex : google.maps.LatLngLiteral[]) => any,
  options?: AreaSelectionOptions,  
  center?: google.maps.LatLngLiteral
  onPlaceChanged?: (place: any, city: string|undefined) => any,
  polygon?: google.maps.LatLngLiteral[]
}

let GMapsPolygon : google.maps.Polygon;
let GMapsAPI : GMapsAPI;

const DEFAULT_OPTIONS = {
  width: '100%',
  height: '400px',
  strokeColor: '#7f101d'
}

const ReactMapsAreaSelection = ({ apiKey, options, polygon, center = CENTER_FOLIGNO, onChange, onPlaceChanged }: Props) => {

  React.useMemo( () => {
    if(!GMapsAPI) return;

    setPolygon(polygon)
  }, [polygon])

  const handleApiLoaded = (mapObj: GMapsAPI ) : void => 
  {
    GMapsAPI = mapObj;

    setPolygon(polygon) 
    setCustomUI()
  }

  function setCustomUI()
  {
    const cityInput = document.createElement('div');
    ReactDOM.render(<SearchCity 
                      maps={GMapsAPI?.maps} 
                      onPlaceChanged={placeChanged} />, cityInput);
    GMapsAPI.map.controls[google.maps.ControlPosition.TOP_LEFT].push(cityInput);

    const resetDiv = document.createElement("div");
    resetButton(resetDiv); 
    GMapsAPI.map.controls[google.maps.ControlPosition.LEFT_TOP].push(resetDiv);
  

    google.maps.event.addDomListener(resetDiv, 'click', resetPolygon);
  }


  async function setPolygon(customPolygon: google.maps.LatLngLiteral[]|null = null) : Promise<any>
  {
    const {map, maps} = GMapsAPI;
    const {lat, lng} = map.getCenter()?.toJSON() as google.maps.LatLngLiteral;
 
    const path = customPolygon ? customPolygon : [
      new maps.LatLng(lat+0.01, lng+0.01),
      new maps.LatLng(lat+0.01, lng-0.01),
      new maps.LatLng(lat-0.01, lng-0.01),
      new maps.LatLng(lat-0.01, lng+0.01)
    ] 

    if(GMapsPolygon) GMapsPolygon.setMap(null)

    GMapsPolygon = new maps.Polygon({
      path: path,
      editable: true,
      draggable: false,
      strokeColor: options?.strokeColor||DEFAULT_OPTIONS.strokeColor,
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map
    });

    class DeleteMenu extends google.maps.OverlayView {

      private div_: HTMLDivElement;
      private divListener_?: google.maps.MapsEventListener;
    
      constructor() { 
        super();
        this.div_ = document.createElement("div");
        this.div_.className = styles.deleteMenu;
        this.div_.innerHTML = `Elimina`;
    
        const menu = this;
        google.maps.event.addDomListener(this.div_, "click", () => {
          menu.removeVertex();
        });
      }
    
      onAdd() {
        const deleteMenu = this;
        const map = this.getMap() as google.maps.Map;
        this.getPanes()!.floatPane.appendChild(this.div_);
    
        // mousedown anywhere on the map except on the menu div will close the
        // menu.
        this.divListener_ = google.maps.event.addDomListener(
          map.getDiv(),
          "mousedown",
          (e: Event) => {
            if (e.target != deleteMenu.div_) {
              deleteMenu.close();
            }
          },
          true
        );
      }
    
      onRemove() {
        if (this.divListener_) {
          google.maps.event.removeListener(this.divListener_);
        }
    
        (this.div_.parentNode as HTMLElement).removeChild(this.div_);
    
        // clean up
        this.set("position", null);
        this.set("path", null);
        this.set("vertex", null);
      }
    
      close() {
        this.setMap(null);
      }
    
      draw() {
        const position = this.get("position");
        const projection = this.getProjection();
    
        if (!position || !projection) {
          return;
        }
    
        const point = projection.fromLatLngToDivPixel(position)!;
        this.div_.style.top = point.y + "px";
        this.div_.style.left = point.x + "px";
      }
    
      /**
       * Opens the menu at a vertex of a given path.
       */
      open(
        map: google.maps.Map,
        path: google.maps.MVCArray<google.maps.LatLng>,
        vertex: number
      ) {
        this.set("position", path.getAt(vertex));
        this.set("path", path);
        this.set("vertex", vertex);
        this.setMap(map);
        this.draw();
      }
    
      /**
       * Deletes the vertex from the path.
       */
      removeVertex() {
        const path = this.get("path");
        const vertex = this.get("vertex");
    
        if (!path || vertex == undefined) {
          this.close();
          return;
        }
    
        path.removeAt(vertex);
        this.close();
      }
    }    

    const deleteMenu = new DeleteMenu();

    maps.event.addListener(GMapsPolygon, "click", (e:any) => {
      if (e.vertex == undefined || GMapsPolygon.getPath().getLength() < 4) {
        return;
      }
      deleteMenu.open(map, GMapsPolygon.getPath(), e.vertex);
    });

    maps.event.addListener(GMapsPolygon, 'click', polygonChanged)
    maps.event.addListener(GMapsPolygon, 'mouseup', polygonChanged)
  }

  function placeChanged(newCenter : google.maps.LatLngLiteral, city: string|undefined)
  {
    if(!GMapsAPI) return 

    GMapsAPI.map.setCenter(newCenter);

    if(onPlaceChanged) onPlaceChanged(newCenter, city);

    setPolygon()
  }

  const resetPolygon = () => 
  {
    if(!GMapsAPI) return;

    setPolygon()
    polygonChanged();
  }

  function polygonChanged()
  {
    onChange(getVertexPoints())
  }

  
  function getVertexPoints() : google.maps.LatLngLiteral[] {
    // Since this polygon has only one path, we can call getPath() to return the
    // MVCArray of LatLngs.
    const vertices = GMapsPolygon.getPath();
    const verticiesObj : google.maps.LatLngLiteral[] = [];
  
    // Iterate over the vertices.
    for (let i = 0; i < vertices.getLength(); i++)
      verticiesObj.push({
        lat: vertices.getAt(i).lat(), 
        lng:  vertices.getAt(i).lng()
      });  
    
   
    return verticiesObj;
  } 

  return ( 
    <div 
      className={styles.mapWrapper}        
      style={{
        width: options?.width||DEFAULT_OPTIONS.width, 
        height: options?.height||DEFAULT_OPTIONS.height
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ 
          key: apiKey,
          libraries: ["places", "visualization"] 
        }}
        defaultCenter={center}
        defaultZoom={12}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      >

      </GoogleMapReact>
    </div>
  )
}



const CENTER_FOLIGNO = {lat: 42.958433, lng: 12.709864}

ReactMapsAreaSelection.propTypes = {
  apiKey: PropTypes.string.isRequired,
  options: PropTypes.shape({
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    strokeColor: PropTypes.string,
  }),
  center: PropTypes.exact({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  onChange: PropTypes.func.isRequired
};

export default ReactMapsAreaSelection;