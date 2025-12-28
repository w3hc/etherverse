'use client'

import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, SimpleGrid, Flex, Badge, Spinner, Center, Stack } from '@chakra-ui/react'
import { Input } from '@/components/ui/input'
import { toaster } from '@/components/ui/toaster'
import { FiSearch, FiExternalLink } from 'react-icons/fi'
import Link from 'next/link'

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

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        toaster.create({
          title: 'Error',
          description: 'Failed to load the awesome list from GitHub',
          type: 'error',
          duration: 5000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAwesomeList()
  }, [])

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
    <Box maxW="container.xl" mx="auto" py={20} px={4}>
      <VStack gap={8} align="stretch">
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
            <Spinner size="xl" color="#45a2f8" borderWidth="4px" />
          </Center>
        ) : (
          <>
            {/* Search */}
            <Box maxW="600px" mx="auto" w="full" position="relative">
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" pointerEvents="none" zIndex={1}>
                <FiSearch color="gray" />
              </Box>
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                pl="10"
                size="lg"
              />
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
                  <Flex align="center" mb={4}>
                    <Heading as="h2" size="lg" color="#45a2f8">
                      {category.title}
                    </Heading>
                    <Badge ml={3} colorPalette="purple" size="sm">
                      {category.resources.length}
                    </Badge>
                  </Flex>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {category.resources.map((resource, idx) => (
                      <Box
                        key={idx}
                        bg="whiteAlpha.100"
                        borderRadius="lg"
                        p={6}
                        transition="all 0.2s"
                        _hover={{
                          bg: 'whiteAlpha.200',
                          transform: 'translateY(-2px)',
                        }}
                      >
                        <Stack gap={3}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                          >
                            <Flex align="center" gap={2}>
                              <Heading as="h3" size="md" color="white" _hover={{ color: '#8c1c84' }}>
                                {resource.name}
                              </Heading>
                              <FiExternalLink size={14} />
                            </Flex>
                          </a>
                          <Text color="gray.400" fontSize="sm">
                            {resource.description}
                          </Text>
                        </Stack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              ))
            )}

            {/* Footer */}
            <Box textAlign="center" pt={10} borderTop="1px" borderColor="gray.700">
              <Text color="gray.400">
                Want to contribute?{' '}
                <a
                  href="https://github.com/w3hc/awesome-ethereum"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#45a2f8', cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#8c1c84')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#45a2f8')}
                >
                  Visit the GitHub repository{' '}
                  <FiExternalLink size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                </a>
              </Text>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  )
}
