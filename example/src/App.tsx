import React from 'react'

import ReactMapsAreaSelection from 'react-maps-area-selection'
import 'react-maps-area-selection/dist/index.css'

console.log(process.env);

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
             />

      <textarea 
        value={vertex.toString()} 
        style={{width:'100%', height:'200px'}}>
      </textarea>
    </div>
  )
}

export default App
