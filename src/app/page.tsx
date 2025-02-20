'use client'

import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Image,
  Center,
} from '@chakra-ui/react'
import Link from 'next/link'

const topics = [
  {
    title: 'Solo Staking',
    description: 'Participate in securing Ethereum through decentralized validation',
  },
  {
    title: 'ETH as an Asset',
    description: "Strengthen Ethereum's position as a foundational digital asset",
  },
  {
    title: 'Unifying L2s',
    description: 'Build a cohesive multi-chain ecosystem through standardization',
  },
]

export default function Home() {
  return (
    <Container maxW="container.xl" py={20}>
      {/* Hero Section */}
      <VStack spacing={8} align="stretch" mb={16}>
        <Heading as="h1" size="2xl" textAlign="center">
          Unite Ethereum
        </Heading>
        <Text fontSize="xl" textAlign="center" color="gray.400" maxW="800px" mx="auto">
          Advancing Ethereum through protocol improvements and standardization. Together we build a
          more unified, secure, and scalable blockchain ecosystem.
        </Text>
        <Box textAlign="center">
          <Link href="/eip-7702">
            <Button
              size="lg"
              bg="#8c1c84"
              color="white"
              _hover={{
                bg: '#6d1566',
              }}
            >
              Explore EIP-7702
            </Button>
          </Link>
        </Box>
      </VStack>
      {/* Topics Grid */}
      <Box mb={16}>
        {/* <Heading as="h2" size="xl" mb={8}>
          Strategic Initiatives
        </Heading> */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {topics.map((topic, index) => (
            <Card key={index} bg="whiteAlpha.100" borderRadius="lg">
              <CardBody>
                <Stack spacing={4}>
                  <Heading as="h3" size="md">
                    {topic.title}
                  </Heading>
                  <Text color="gray.400">{topic.description}</Text>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
      {/* Knowledge Base Section */}
      {/* <VStack spacing={8} align="stretch" mb={16}>
        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Knowledge Hub
          </Heading>
          <Text color="gray.400">
            Access comprehensive resources and documentation about Ethereum protocol improvements
            and ecosystem development.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Governance
          </Heading>
          <Text color="gray.400">
            Participate in shaping Ethereum&apos;s future through transparent and decentralized
            decision-making processes.
          </Text>
        </Box>
      </VStack> */}
      {/* Logo */}
      <Center mt={20}>
        <Box p={4}>
          <Image
            src="https://bafkreid5xwxz4bed67bxb2wjmwsec4uhlcjviwy7pkzwoyu5oesjd3sp64.ipfs.w3s.link"
            alt="Ethereum Logo"
            boxSize="200px" // Reduces the image size
            objectFit="contain"
          />
        </Box>
      </Center>
    </Container>
  )
}
