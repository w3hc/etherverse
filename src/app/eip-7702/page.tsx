'use client'

import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  List,
  ListItem,
  ListIcon,
  Button,
  SimpleGrid,
  Code,
  Link as ChakraLink,
  HStack,
} from '@chakra-ui/react'
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'

export default function EIP7702Page() {
  const handleTest = () => {
    console.log('Test EIP-7702 here.')
  }

  return (
    <Container maxW="container.lg" py={20}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" mb={4}>
            EIP-7702: Account Code Setting
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Gives EOAs smart contract capabilities through a new transaction type...
          </Text>
        </Box>

        <Box borderWidth="2px" borderRadius="lg" p={6} borderColor="#45a2f8">
          <VStack spacing={4} align="stretch">
            <Heading as="h3" size="md">
              Try it out!
            </Heading>

            <HStack spacing={4}>
              <Button bg="#8c1c84" color="white" _hover={{ bg: '#6d1566' }} onClick={handleTest}>
                Test
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Core Features
          </Heading>
          <List spacing={4}>
            <ListItem display="flex" alignItems="flex-start">
              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
              <Text>
                <strong>Transaction Batching:</strong> Execute multiple operations atomically, such
                as token approvals and transfers in a single transaction
              </Text>
            </ListItem>
            <ListItem display="flex" alignItems="flex-start">
              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
              <Text>
                <strong>Transaction Sponsorship:</strong> Enable gas fee sponsorship where one
                account can pay for another&apos;s transactions
              </Text>
            </ListItem>
            <ListItem display="flex" alignItems="flex-start">
              <ListIcon as={CheckCircleIcon} color="green.500" mt={1} />
              <Text>
                <strong>Privilege De-escalation:</strong> Create sub-keys with specific permissions
                for enhanced security
              </Text>
            </ListItem>
          </List>
        </Box>

        <Box borderWidth="2px" borderRadius="lg" p={6} borderColor="#45a2f8">
          <VStack spacing={4} align="stretch">
            <Heading as="h3" size="md">
              Docs
            </Heading>
            <Text>
              Experience the power of enhanced EOAs by testing the implementation in a safe
              environment.
            </Text>
            <HStack spacing={4}>
              <ChakraLink href="https://eip7702.io" isExternal>
                <Button
                  rightIcon={<ExternalLinkIcon />}
                  bg="#8c1c84"
                  color="white"
                  _hover={{ bg: '#6d1566' }}
                >
                  Documentation
                </Button>
              </ChakraLink>
              <ChakraLink href="https://github.com/w3hc/eip7702-playground" isExternal>
                <Button
                  rightIcon={<ExternalLinkIcon />}
                  variant="outline"
                  borderColor="#8c1c84"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Playground
                </Button>
              </ChakraLink>
            </HStack>
          </VStack>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Technical Details
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <Heading as="h3" size="md" mb={3}>
                Implementation
              </Heading>
              <Text mb={3}>
                EIP-7702 introduces a new transaction type (0x04) that allows EOAs to set their code
                based on existing smart contracts through signed authorizations.
              </Text>
              <Code p={3} display="block" whiteSpace="pre" bg="whiteAlpha.100" mb={3} color="white">
                {`0xef0100 || address\n// Delegation designation format`}
              </Code>
            </Box>
            <Box>
              <Heading as="h3" size="md" mb={3}>
                Security Considerations
              </Heading>
              <List spacing={2}>
                <ListItem>• Built-in revocation mechanism</ListItem>
                <ListItem>• Chain-specific or universal deployment options</ListItem>
                <ListItem>• Storage namespace protection</ListItem>
                <ListItem>• Secure delegation patterns</ListItem>
              </List>
            </Box>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Benefits
          </Heading>
          <Text mb={4}>
            EIP-7702 maintains compatibility with existing infrastructure while providing enhanced
            functionality:
          </Text>
          <List spacing={3}>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text>Compatible with EIP-4337 account abstraction</Text>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text>Works with existing smart account implementations</Text>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text>Flexible authorization schemes</Text>
            </ListItem>
          </List>
        </Box>
      </VStack>
    </Container>
  )
}
