import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { parse } from 'yaml'
import { useState } from 'react'
import { validateCRD } from '../CRD'

function CRDModal({ isOpen, onClose, setCRD }) {
  const [tabIndex, setTabIndex] = useState(0)
  const [url, setURL] = useState('')
  const [content, setContent] = useState('')
  const [err, setErr] = useState(null)

  const validateCRDOrError = (text) => {
    try {
      const doc = parse(text)
      const error = validateCRD(doc)
      if (error) {
        setErr('Invalid CRD: ' + error.message)
      } else {
        setCRD(doc)
        setURL('')
        setContent('')
        onClose()
      }
    } catch (error) {
      setErr('Error parsing text as YAML: ' + error.message)
    }
  }

  const onSave = (index) => {
    setErr(null)
    if (index === 0) {
      fetch(url)
        .then(res => res.text())
        .then(
          (result) => {
            validateCRDOrError(result)
          },
          (error) => {
            setErr('Error: ' + error.message)
          }
        )
    } else if (index === 1) {
      validateCRDOrError(content)
    }
  }

  return (
    <Modal size='6xl' isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose a new Custom Resource Definition</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>From URL</Tab>
              <Tab>Paste content</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Input value={url} onChange={(e) => setURL(e.target.value)} placeholder='https://example.com/my-crd.yaml' />
              </TabPanel>
              <TabPanel>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='apiVersion: apiextensions.k8s.io/v1...' />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Text mt='16px' color='red'>{err}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => onSave(tabIndex)}>
            Save
          </Button>
          <Button variant='ghost' onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CRDModal;
