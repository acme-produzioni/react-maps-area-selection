import React from 'react'

import ReactMapsAreaSelection from 'react-maps-area-selection'
import 'react-maps-area-selection/dist/index.css'

const POLYGON_TEST = [
  { lng: 12.6115981, lat: 42.9642201 },
  { lng: 12.6491471, lat: 42.9212276 },
  { lng: 12.7051528, lat: 42.9040477 },
  { lng: 12.8058132, lat: 42.9337574 },
  { lng: 12.9285227, lat: 42.9223669 },
  { lng: 12.951433, lat: 42.9338658 },
  { lng: 12.8958221, lat: 42.964592 },
  { lng: 12.9082279, lat: 42.9853133 },
  { lng: 12.8879665, lat: 43.0106832 },
  { lng: 12.906709, lat: 43.0353934 },
  { lng: 12.8900745, lat: 43.059502 },
  { lng: 12.7971959, lat: 43.0721145 },
  { lng: 12.7965344, lat: 43.0284767 },
  { lng: 12.7233921, lat: 43.0339232 },
  { lng: 12.7255362, lat: 43.012646 },
  { lng: 12.6891963, lat: 42.9763281 },
  { lng: 12.611598, lat: 42.96422 }
]


const convertArrayToLatLngLiteral = (coordsArray: Array<any>) => {

  return coordsArray[0].map((i : number[]) => ({lng: i[0], lat: i[1]}))
}


const App = () => {
  const [vertex, setVertex] = React.useState<google.maps.LatLngLiteral[]>(POLYGON_TEST);

  function getCityBoundary(_center: google.maps.LatLngLiteral|undefined, city: string|undefined)
  {
    return fetch(`http://open.mapquestapi.com/nominatim/v1/search.php?key=${process?.env?.REACT_APP_QUEST_API_KEY||''}&format=json&q=${city}&limit=1&&polygon_geojson=1&polygon_threshold=0.01&featuretype=city`)
        .then(response => response.json())
        .then(data => {
          if(data[0]?.geojson !== undefined)
            setVertex(convertArrayToLatLngLiteral(data[0]?.geojson?.coordinates))            
        })
        .catch((error) => {
          console.error(error)         
        });
  }

  return (
    <div>
      <ReactMapsAreaSelection 
            options={{
              width: '100%',
              height: "400px",
            }} 
            apiKey={process?.env?.REACT_APP_API_KEY||''}
            onChange={(vertex : google.maps.LatLngLiteral[]) => setVertex(vertex)}
            polygon={vertex} //remove this props to get default polygon centered on your coords
            onPlaceChanged={getCityBoundary}
      />

      <textarea 
        readOnly
        value={vertex.map(i => `(${i.lat},${i.lng})`)} 
        style={{width:'100%', height:'200px'}}>
      </textarea>
    </div>
  )
}

export default App
