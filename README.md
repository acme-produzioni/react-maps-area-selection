# NOT YET PUBLISHED!

# react-maps-area-selection

> Define an area on a map using a polygon

[![NPM](https://img.shields.io/npm/v/react-maps-area-selection.svg)](https://www.npmjs.com/package/react-maps-area-selection) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-maps-area-selection
```
```bash
yarn add --save react-maps-area-selection
```

## Usage

```tsx
import React, { Component } from 'react'

import ReactMapAreaSelection from 'react-maps-area-selection'
import 'react-maps-area-selection/dist/index.css'

class Example extends Component {
  render() {
    return <ReactMapAreaSelection />
  }
}
```

## License

MIT © [acme-produzioni](https://github.com/acme-produzioni)

## TO-DO
- [Restricted Map Bounds](https://developers.google.com/maps/documentation/javascript/examples/control-bounds-restriction)
- [Get city boundries from Open StreetMap API](https://nominatim.org/release-docs/develop/api/Lookup/#polygon-output)
