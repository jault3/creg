# CREG - Custom ResourcE Generator

CREG is a website for generating and validating a Custom Resource (CR) from a Kubernetes Custom Resource Definition (CRD). You can use CREG to build your CR from scratch, or validate an already existing one to figure out exactly which line violates the CRD schema.

## Quick Start

To get up and running locally, run:

```
npm i
npm start
```

## Third Party Libraries

CREG makes use of the following libraries:

* [Chakra UI](https://chakra-ui.com) for a component library
* [React Monaco Editor](https://github.com/react-monaco-editor/react-monaco-editor) for providing [Monaco Editor](https://github.com/microsoft/monaco-editor) as a React component to edit the CR
* [Monaco YAML](https://github.com/remcohaszing/monaco-yaml) to add schema validation for YAML files in Monaco
* [monaco-editor-webpack-plugin](https://www.npmjs.com/package/monaco-editor-webpack-plugin) to make loading Monaco with webpack easier
* [JS-YAML](https://github.com/nodeca/js-yaml) for loading CRD YAML files as objects
* [Craco](https://github.com/gsoft-inc/craco) for being able to use monaco-editor-webpack-plugin without ejecting
