import * as React from 'react'
import styles from './styles.css'


interface Props {
   onPlaceChanged: (newCenter : google.maps.LatLngLiteral) => void
   maps : any
  }

let googleAutocomplete : google.maps.places.Autocomplete;

const SearchCity = ({ maps, onPlaceChanged }: Props) => {

    const [googleMaps, setGoogleMaps] = React.useState();
    const autocompleteInput = React.useRef(null);

    React.useEffect(() => {             
        if(!maps || googleMaps !== undefined || autocompleteInput.current === null) return;

        setGoogleMaps(maps);

        const options = {
            //componentRestrictions: { country: "it" },
            fields: ["formatted_address", "geometry", "name"],           
            strictBounds: false,
            types: ["geocode"],
          } as google.maps.places.AutocompleteOptions;

        googleAutocomplete = new maps.places.Autocomplete(autocompleteInput.current, options)

        googleAutocomplete.addListener("place_changed", placeChanged);

    }, [maps, autocompleteInput.current])

    function placeChanged()
    {
      
      const place = googleAutocomplete.getPlace().geometry?.location;

        if(place === undefined) return;

        onPlaceChanged({
            lat: place.lat(),
            lng: place.lng()
        })
    }    


    return ( 
      <div        
        className={styles.searchCityWrapper}>        
          <input type="text" className={styles.gmapsAutocomplete} ref={autocompleteInput}/>
        
      </div>
    )
  }

export default SearchCity;