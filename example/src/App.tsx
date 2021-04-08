import React from 'react'

import ReactMapsAreaSelection from 'react-maps-area-selection'
import 'react-maps-area-selection/dist/index.css'

const App = () => {
  const [vertex, setVertex] = React.useState<number[]>([]);
  return (
    <div>
      <ReactMapsAreaSelection 
            options={{
              width: '100%',
              height: "400px",
            }} 
            apiKey="putyourkeyhere"
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
