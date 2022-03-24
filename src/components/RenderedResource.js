import { useEffect, useState } from 'react'
import { VStack } from '@chakra-ui/react'
import { dump } from 'js-yaml'
import MonacoEditor, { monaco } from 'react-monaco-editor'
import { setDiagnosticsOptions } from 'monaco-yaml'
// see https://github.com/remcohaszing/monaco-yaml/issues/92
// eslint-disable-next-line import/no-webpack-loader-syntax
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker.js'
// eslint-disable-next-line import/no-webpack-loader-syntax
import YamlWorker from 'worker-loader!monaco-yaml/yaml.worker.js'
import { getSchema } from '../CRD'

window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    if (label === 'yaml') {
      return new YamlWorker()
    }
    return new EditorWorker()
  },
}

const getObjectFromSchema = (schema) => {
  let ret = null
  switch (schema.type) {
    case 'object':
      ret = {}
      if (schema.properties) {
        Object.keys(schema.properties).forEach((a) => {
          ret[a] = getObjectFromSchema(schema.properties[a])
        })
      }
      break
    case 'boolean':
      ret = true
      break
    case 'string':
      ret = 'a string'
      break
    case 'integer':
      ret = 0
      break
    case 'array':
      ret = []
      break
    default:
      break
  }
  return ret
}

const getResource = (crd) => {
  const version = crd.spec.versions.filter((m) => m.served)[0]
  let res = {
    apiVersion: `${crd.spec.group}/${version.name}`,
    kind: crd.spec.names.kind,
    metadata: {
      name: 'my-cr',
      namespace: 'default',
    },
  }

  const schema = getSchema(crd)

  Object.keys(schema.properties).forEach((a) => {
    res[a] = getObjectFromSchema(schema.properties[a])
  })
  res.apiVersion = `${crd.spec.group}/${version.name}`
  res.kind = crd.spec.names.kind
  res.metadata = {
    name: 'my-cr',
    namespace: 'default',
  }
  return dump(res)
}

function RenderedResource({ crd, setNumErrors }) {
  let [value, setValue] = useState(getResource(crd))

  useEffect(() => {
    setValue(getResource(crd))
  }, [crd])

  let handleInputChange = (newValue) => {
    setValue(newValue)
  }

  const editorDidMount = (editor, monaco) => {
    editor.focus()
    editor.onDidChangeModelDecorations(onDidChangeModelDecorations)
  }

  const onDidChangeModelDecorations = () => {
    const markers = monaco.editor.getModelMarkers({ owner: 'yaml' })
    setNumErrors(markers.length)
  }

  useEffect(() => {
    setDiagnosticsOptions({
      schemas: [{uri: 'http://creg/schema.json', fileMatch: ["*"], schema: getSchema(crd)}],
    });
  }, [crd])

  return (
    <VStack flex='1' align='stretch'>
      <MonacoEditor
        language="yaml"
        theme="vs-dark"
        value={value}
        onChange={handleInputChange}
        editorDidMount={editorDidMount}
      />
    </VStack>
  );
}

export default RenderedResource;
