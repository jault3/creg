import { Flex, VStack } from '@chakra-ui/react'
import NavBar from './components/NavBar'
import Definition from './components/Definition'
import RenderedResource from './components/RenderedResource'
import crd from './CRD.js'

function App() {
  const crdDef = crd()
  return (
    <VStack align='stretch' h='100vh'>
      <NavBar />
      <Flex flex='1' overflow='scroll'>
        <Definition crd={crdDef} />
        <RenderedResource crd={crdDef} />
      </Flex>
    </VStack>
  );
}

export default App;
