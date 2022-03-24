import { Text } from '@chakra-ui/react'
import { CheckCircleIcon, WarningTwoIcon } from '@chakra-ui/icons'

function StatusMessage({ numErrors }) {
  if (numErrors === 0) {
    return (
      <Text>
        <CheckCircleIcon color='green' /> Your custom resource is valid!
      </Text>
    )
  }
  return (
    <Text>
      <WarningTwoIcon color='yellow' /> You have {numErrors} errors in your custom resource below
    </Text>
  )
}

export default StatusMessage;
