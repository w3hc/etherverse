'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { SearchIcon, ExternalLinkIcon } from '@chakra-ui/icons'

interface Resource {
  name: string
  url: string
  description: string
}

interface Category {
  title: string
  slug: string
  resources: Resource[]
}

function parseMarkdown(markdown: string): Category[] {
  const lines = markdown.split('\n')
  const categories: Category[] = []
  let currentCategory: Category | null = null

  for (const line of lines) {
    // Match category headers (## Title) but skip Contents
    if (line.startsWith('## ') && !line.includes('Contents')) {
      if (currentCategory && currentCategory.resources.length > 0) {
        categories.push(currentCategory)
      }
      const title = line.replace('## ', '').trim()
      currentCategory = {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        resources: [],
      }
    }

    // Match resources (- [Name](url) - Description)
    if (line.startsWith('- [') && currentCategory) {
      const match = line.match(/- \[(.*?)\]\((.*?)\) - (.*)/)
      if (match) {
        currentCategory.resources.push({
          name: match[1],
          url: match[2],
          description: match[3].replace(/\.$/, ''),
        })
      }
    }
  }

  if (currentCategory && currentCategory.resources.length > 0) {
    categories.push(currentCategory)
  }

  // Filter out meta sections
  return categories.filter(cat => !['Contribute', 'Contact'].includes(cat.title))
}

export default function AwesomeEthereumPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchAwesomeList = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/w3hc/awesome-ethereum/main/README.md'
        )
        if (!response.ok) throw new Error('Failed to fetch')

        const markdown = await response.text()
        const parsedCategories = parseMarkdown(markdown)

        setCategories(parsedCategories)
        setFilteredCategories(parsedCategories)
      } catch (error) {
        console.error('Error loading awesome list:', error)
        toast({
          title: 'Error',
          description: 'Failed to load the awesome list from GitHub',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAwesomeList()
  }, [toast])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = categories
      .map(category => ({
        ...category,
        resources: category.resources.filter(
          resource =>
            resource.name.toLowerCase().includes(term) ||
            resource.description.toLowerCase().includes(term)
        ),
      }))
      .filter(category => category.resources.length > 0)

    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Awesome Ethereum
          </Heading>
          <Text fontSize="xl" color="gray.400" maxW="800px" mx="auto">
            An opinionated curated list of awesome Ethereum resources, libraries, tools and more
          </Text>
        </Box>

        {isLoading ? (
          <Center py={20}>
            <Spinner size="xl" color="#45a2f8" thickness="4px" />
          </Center>
        ) : (
          <>
            {/* Search */}
            <Box maxW="600px" mx="auto" w="full">
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  borderColor="gray.700"
                  _focus={{
                    borderColor: '#45a2f8',
                    boxShadow: 'none',
                  }}
                />
              </InputGroup>
            </Box>

            {/* Categories */}
            {filteredCategories.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Text color="gray.400" fontSize="lg">
                  No resources found matching &quot;{searchTerm}&quot;
                </Text>
              </Box>
            ) : (
              filteredCategories.map(category => (
                <Box key={category.slug} id={category.slug}>
                  <Heading as="h2" size="lg" mb={4} color="#45a2f8">
                    {category.title}
                    <Badge ml={3} colorScheme="purple" fontSize="sm">
                      {category.resources.length}
                    </Badge>
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {category.resources.map((resource, idx) => (
                      <Card
                        key={idx}
                        bg="whiteAlpha.100"
                        borderRadius="lg"
                        _hover={{
                          bg: 'whiteAlpha.200',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <CardBody>
                          <Stack spacing={3}>
                            <Link
                              href={resource.url}
                              isExternal
                              _hover={{ textDecoration: 'none' }}
                            >
                              <Heading
                                as="h3"
                                size="md"
                                color="white"
                                _hover={{ color: '#8c1c84' }}
                              >
                                {resource.name}
                                <ExternalLinkIcon ml={2} fontSize="sm" />
                              </Heading>
                            </Link>
                            <Text color="gray.400" fontSize="sm">
                              {resource.description}
                            </Text>
                          </Stack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              ))
            )}

            {/* Footer */}
            <Box textAlign="center" pt={10} borderTop="1px" borderColor="gray.700">
              <Text color="gray.400">
                Want to contribute?{' '}
                <Link
                  href="https://github.com/w3hc/awesome-ethereum"
                  isExternal
                  color="#45a2f8"
                  _hover={{ color: '#8c1c84' }}
                >
                  Visit the GitHub repository
                  <ExternalLinkIcon ml={1} />
                </Link>
              </Text>
            </Box>
          </>
        )}
      </VStack>
    </Container>
  )
}
