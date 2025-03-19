/// <reference types="google.maps" />
import PropTypes from 'prop-types';
interface AreaSelectionOptions {
    width?: string | number;
    height?: string | number;
    strokeColor?: string;
}
interface Props {
    apiKey: string;
    onChange: (vertex: google.maps.LatLngLiteral[]) => any;
    options?: AreaSelectionOptions;
    center?: google.maps.LatLngLiteral;
    onPlaceChanged?: (place: any, city: string | undefined) => any;
    polygon?: google.maps.LatLngLiteral[];
}
declare const ReactMapsAreaSelection: {
    ({ apiKey, options, polygon, center, onChange, onPlaceChanged }: Props): JSX.Element;
    propTypes: {
        apiKey: PropTypes.Validator<string>;
        options: PropTypes.Requireable<PropTypes.InferProps<{
            width: PropTypes.Requireable<string | number>;
            height: PropTypes.Requireable<string | number>;
            strokeColor: PropTypes.Requireable<string>;
        }>>;
        center: PropTypes.Requireable<Required<PropTypes.InferProps<{
            lat: PropTypes.Validator<number>;
            lng: PropTypes.Validator<number>;
        }>>>;
        onChange: PropTypes.Validator<(...args: any[]) => any>;
    };
};
export default ReactMapsAreaSelection;
