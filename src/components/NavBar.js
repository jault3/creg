import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconButton, Flex, Spacer, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

function NavBar() {
  const { toggleColorMode } = useColorMode()
  const ThemeToggleIcon = useColorModeValue(MoonIcon, SunIcon)
  return (
    <Flex p='12px' align='center' bg={useColorModeValue('green.500', 'green.900')}>
      <Text fontSize='xl'>CREG - Custom ResourcE Generator</Text>
      <Spacer />
      <IconButton onClick={toggleColorMode} icon={<ThemeToggleIcon />} variant='ghost' />
    </Flex>
  )
}

export default NavBar
