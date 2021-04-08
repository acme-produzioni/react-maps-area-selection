import React from 'react'

import ReactMapsAreaSelection from 'react-maps-area-selection'
import 'react-maps-area-selection/dist/index.css'

const POLYGON_TEST = [
  {lat: 42.96843299999998, lng: 12.72226725927732},
  {lat: 42.96843299999998, lng: 12.699863999999982},
  {lat: 42.96144886070562, lng: 12.69196757666012},
  {lat: 42.94843299999999, lng: 12.699863999999982},
  {lat: 42.94843299999999, lng: 12.719863999999982},
  {lat: 42.95667496629343, lng: 12.725872148193336}]

const App = () => {
  const [vertex, setVertex] = React.useState<number[]>([]);
  return (
    <div>
      <ReactMapsAreaSelection 
            options={{
              width: '100%',
              height: "400px",
            }} 
            apiKey={process?.env?.REACT_APP_API_KEY||''}
            onChange={(vertex : number[]) => setVertex(vertex)}
            initialPolygon={POLYGON_TEST} //remove this props to get default polygon centered on your coords
      />

      <textarea 
        value={vertex.toString()} 
        style={{width:'100%', height:'200px'}}>
      </textarea>
    </div>
  )
}

export default App
