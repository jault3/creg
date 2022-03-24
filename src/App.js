import { Button, Flex, Spacer, useDisclosure, VStack } from '@chakra-ui/react'
import NavBar from './components/NavBar'
import Definition from './components/Definition'
import RenderedResource from './components/RenderedResource'
import { getSampleCRD } from './CRD.js'
import { useState } from 'react'
import StatusMessage from './components/StatusMessage'
import CRDModal from './components/CRDModal'

function App() {
  let [crd, setCRD] = useState(getSampleCRD())
  let [numErrors, setNumErrors] = useState('Loading...')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <VStack align='stretch' h='100vh'>
      <NavBar />
      <Flex p='12px' align='center'>
        <Button onClick={onOpen}>Choose new CRD</Button>
        <Spacer />
        <StatusMessage numErrors={numErrors} />
      </Flex>
      <Flex flex='1' overflow='scroll'>
        <Definition crd={crd} />
        <RenderedResource crd={crd} setNumErrors={setNumErrors} />
      </Flex>

      <CRDModal onClose={onClose} isOpen={isOpen} setCRD={setCRD} />
    </VStack>
  );
}

export default App;
