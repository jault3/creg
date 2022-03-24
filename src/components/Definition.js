import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Code,
  Text,
  VStack,
} from '@chakra-ui/react'
import { getSchema } from '../CRD'

const getPanel = (schema, name, path, isRequired) => {
  return <Box pl='16px' pb='16px' flex='1' textAlign='left' key={path+'.'+name}>
    <Text pr='5px'><strong>{name} {isRequired && '*'}</strong> <Code>{schema.type}</Code></Text>
    <Text pr='5px'>{schema.description}</Text>
    {schema.enum && (
      <Text pr='5px' as='i'>Allowable values: {JSON.stringify(schema.enum)}</Text>
    )}
    {(schema.minimum || schema.maximum) && (
      <Text pr='5px' as='i'>Min: {schema.minimum}, Max: {schema.maximum}</Text>
    )}
    {schema.pattern && (
      <Text pr='5px' as='i'>Pattern: {schema.pattern}</Text>
    )}
  </Box>
}

const getValueFromSchema = (schema, name, path, required) => {
  let ret = null
  const isRequired = required.indexOf(name) !== -1
  switch (schema.type) {
    case 'object':
      if (schema.properties) {
        ret = <AccordionItem key={path+'.'+name}>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                <Text><strong>{name} {isRequired && '*'}</strong> <Code>{schema.type}</Code></Text>
                <Text>{schema.description}</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb='16px' pr='0px'>
            {Object.keys(schema.properties).map((k) => (
              getValueFromSchema(schema.properties[k], k, path+'.'+name, schema.required || [])
            ))}
          </AccordionPanel>
        </AccordionItem>
      } else {
        ret = getPanel(schema, name, path, isRequired)
      }
      break
    case 'array':
      ret = <AccordionItem key={path+'.'+name}>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              <Text><strong>{name} {isRequired && '*'}</strong> <Code>{schema.type}</Code></Text>
              <Text>{schema.description}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb='16px' pr='0px'>
          {getValueFromSchema(schema.items, 'items', path+'.items', [])}
        </AccordionPanel>
      </AccordionItem>
      break
    case 'boolean':
    case 'string':
    case 'integer':
    case 'number':
      ret = getPanel(schema, name, path, isRequired)
      break
    default:
      break
  }

  return ret
}

function Definition({crd}) {
  const schema = getSchema(crd)
  return (
    <VStack flex='1' align='stretch'>
      <Accordion allowMultiple overflow='scroll'>
        {Object.keys(schema.properties).map((k) => (
          getValueFromSchema(schema.properties[k], k, 'root', schema.required || [])
        ))}
      </Accordion>
    </VStack>
   );
}

export default Definition;
