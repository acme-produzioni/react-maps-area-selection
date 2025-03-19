/// <reference types="google.maps" />
interface Props {
    onPlaceChanged: (newCenter: google.maps.LatLngLiteral, city: string | undefined) => void;
    maps: any;
}
declare const SearchCity: ({ maps, onPlaceChanged }: Props) => JSX.Element;
export default SearchCity;
