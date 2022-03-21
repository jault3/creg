import { useMemo, useState } from 'react';
import { Button, Flex, Text, Textarea, useColorModeValue, VStack } from '@chakra-ui/react';
import { dump, load } from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats'

const getObjectFromSchema = (schema) => {
  let ret = null;
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
      name: 'my-app',
      namespace: 'default',
    },
  }

  const schema = getSchema(crd)

  Object.keys(schema.properties).forEach((a) => {
    res[a] = getObjectFromSchema(schema.properties[a])
  })
  return dump(res)
}

const getSchema = (crd) => {
  const version = crd.spec.versions.filter((m) => m.served)[0]
  return version.schema.openAPIV3Schema
}

function RenderedResource({crd}) {
  let [value, setValue] = useState(getResource(crd))
  let [msg, setMsg] = useState({value: '', color: 'green'})

  const validate = useMemo(() => {
    const ajv = new Ajv({allErrors: true, verbose: true})
    addFormats(ajv)
    const schema = getSchema(crd)
    schema.additionalProperties = false
    // console.log(schema)
    return ajv.compile(schema)
  }, [crd])

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }

  const validateDoc = (crd, doc) => {
    const yamldoc = load(doc)
    delete yamldoc['apiVersion']
    delete yamldoc['kind']
    delete yamldoc['metadata']
    // console.log(yamldoc)
    const valid = validate(yamldoc)
    console.log(valid)
    console.log(validate.errors)
    if (!valid) {
      setMsg({value: 'Errors found. Check the browser console for details.', color: 'red'})
      validate.errors.forEach((e) => {
        console.log(e)
      })
    } else {
      setMsg({value: 'Custom resource is valid', color: 'green'})
    }
  }

  return (
    <VStack flex='1' align='stretch'>
      <Flex align='center'>
        <Button onClick={() => validateDoc(crd, value)}>Validate</Button>
        <Text ml='16px' color={msg.color}>{msg.value}</Text>
      </Flex>
      <Textarea bg={useColorModeValue('gray.100', 'gray.700')} flex='1' variant='outline' resize='none' value={value} onChange={handleInputChange} />
    </VStack>
  );
}

export default RenderedResource;
