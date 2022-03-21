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

const getServedSchema = (crd) => {
  const version = crd.spec.versions.filter((m) => m.served)[0]
  return version.schema.openAPIV3Schema
}

const getPanel = (schema, name, path) => {
  return <Box pl='16px' pb='16px' flex='1' textAlign='left' key={path+'.'+name}>
    <Text><strong>{name}</strong> <Code>{schema.type}</Code></Text>
    <Text>{schema.description}</Text>
  </Box>
}

const getValueFromSchema = (schema, name, path) => {
  let ret = null;
  switch (schema.type) {
    case 'object':
      if (schema.properties) {
        ret = <AccordionItem key={path+'.'+name}>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                <Text><strong>{name}</strong> <Code>{schema.type}</Code></Text>
                <Text>{schema.description}</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb='16px' pr='0px'>
            {Object.keys(schema.properties).map((k) => (
              getValueFromSchema(schema.properties[k], k, path+'.'+name)
            ))}
          </AccordionPanel>
        </AccordionItem>
      } else {
        ret = getPanel(schema, name, path)
      }
      break
    case 'array':
      ret = <AccordionItem key={path+'.'+name}>
        <h2>
          <AccordionButton>
            <Box flex='1' textAlign='left'>
              <Text><strong>{name}</strong> <Code>{schema.type}</Code></Text>
              <Text>{schema.description}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb='16px' pr='0px'>
          {getValueFromSchema(schema.items, 'items', path+'.items')}
        </AccordionPanel>
      </AccordionItem>
      break
    case 'boolean':
    case 'string':
    case 'integer':
      ret = getPanel(schema, name, path)
      break
    default:
      break
  }

  return ret
}

function Definition({crd}) {
  const schema = getServedSchema(crd)
  return (
    <VStack flex='1' align='stretch'>
      <Accordion allowMultiple overflow='scroll'>
        {Object.keys(schema.properties).map((k) => (
          getValueFromSchema(schema.properties[k], k, 'root')
        ))}
      </Accordion>
    </VStack>
   );
}

export default Definition;
