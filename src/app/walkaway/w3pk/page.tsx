'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  Separator,
  Spinner,
  Center,
} from '@chakra-ui/react'
import {
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
  FiAlertTriangle,
  FiTrendingUp,
} from 'react-icons/fi'
import { toaster } from '@/components/ui/toaster'
import { brandColors } from '@/theme'

interface PathToHundredItem {
  action: string
  criterion: string
  points_gained: number
  difficulty: string
  breaking_change: boolean
}

interface WalkawayReport {
  passes_the_walkaway_test: boolean
  walkaway_score: number
  project: string
  url: string
  category: string
  verdict_summary: string
  confidence: string
  criteria: Record<string, boolean>
  failure_points: string[]
  path_to_100: PathToHundredItem[]
  what_survives: string[]
  evidence: string[]
  notes: string
}

function parseReport(raw: string): WalkawayReport {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/)
  const jsonText = fenced ? fenced[1] : raw
  return JSON.parse(jsonText) as WalkawayReport
}

function formatLabel(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function scoreColor(score: number): string {
  if (score >= 90) return '#4ade80'
  if (score >= 70) return '#facc15'
  return '#f87171'
}

export default function W3pkWalkawayReportPage() {
  const [report, setReport] = useState<WalkawayReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch('/OUTPUT_W3PK_NEW.json')
        if (!response.ok) throw new Error('Failed to fetch')

        const data = await response.json()
        setReport(parseReport(data.output))
      } catch (error) {
        console.error('Error loading walk-away report:', error)
        toaster.create({
          title: 'Error',
          description: 'Failed to load the w3pk walk-away test report',
          type: 'error',
          duration: 5000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [])

  if (isLoading) {
    return (
      <Center py={40}>
        <Spinner size="xl" color={brandColors.accent} borderWidth="4px" />
      </Center>
    )
  }

  if (!report) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="gray.400" fontSize="lg">
          Report unavailable.
        </Text>
      </Box>
    )
  }

  const criteriaEntries = Object.entries(report.criteria)

  return (
    <Box maxW="container.md" mx="auto" py={20} px={4}>
      <VStack gap={10} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Badge colorPalette="purple" mb={3} textTransform="uppercase">
            {report.category}
          </Badge>
          <Heading as="h1" size="2xl" mb={2}>
            {report.project}
          </Heading>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <HStack justify="center" gap={1} color={brandColors.accent}>
              <Text fontSize="sm">{report.url}</Text>
              <FiExternalLink size={14} />
            </HStack>
          </a>
        </Box>

        {/* Score */}
        <Box textAlign="center" bg="whiteAlpha.100" borderRadius="xl" py={8}>
          <Text
            fontSize="6xl"
            fontWeight="bold"
            color={scoreColor(report.walkaway_score)}
            lineHeight="1"
          >
            {report.walkaway_score}
          </Text>
          <Text color="gray.400" mb={3}>
            / 100
          </Text>
          <HStack justify="center" gap={3}>
            <Badge
              colorPalette={report.passes_the_walkaway_test ? 'green' : 'red'}
              size="lg"
              px={3}
              py={1}
            >
              {report.passes_the_walkaway_test
                ? 'Passes the walk-away test'
                : 'Fails the walk-away test'}
            </Badge>
            <Badge colorPalette="gray" size="lg" px={3} py={1} textTransform="capitalize">
              {report.confidence} confidence
            </Badge>
          </HStack>
        </Box>

        {/* Verdict */}
        <Box>
          <Heading as="h2" size="md" mb={3} color={brandColors.accent}>
            Verdict
          </Heading>
          <Text color="gray.300" lineHeight="tall">
            {report.verdict_summary}
          </Text>
        </Box>

        <Separator />

        {/* Criteria */}
        <Box>
          <Heading as="h2" size="md" mb={4} color={brandColors.accent}>
            Criteria
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
            {criteriaEntries.map(([key, passed]) => (
              <HStack
                key={key}
                bg="whiteAlpha.100"
                borderRadius="lg"
                p={3}
                gap={3}
                align="flex-start"
              >
                {passed ? (
                  <FiCheckCircle
                    color="#4ade80"
                    size={20}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                ) : (
                  <FiXCircle color="#f87171" size={20} style={{ marginTop: 2, flexShrink: 0 }} />
                )}
                <Text fontSize="sm">{formatLabel(key)}</Text>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>

        <Separator />

        {/* Failure points */}
        <Box>
          <HStack mb={4}>
            <FiAlertTriangle color="#facc15" />
            <Heading as="h2" size="md" color={brandColors.accent}>
              Failure points
            </Heading>
          </HStack>
          <VStack gap={3} align="stretch">
            {report.failure_points.map((point, idx) => (
              <Box key={idx} bg="whiteAlpha.100" borderRadius="lg" p={4}>
                <Text fontSize="sm" color="gray.300">
                  {point}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <Separator />

        {/* Path to 100 */}
        <Box>
          <HStack mb={4}>
            <FiTrendingUp color={brandColors.accent} />
            <Heading as="h2" size="md" color={brandColors.accent}>
              Path to 100
            </Heading>
          </HStack>
          <VStack gap={3} align="stretch">
            {report.path_to_100.map((item, idx) => (
              <Box key={idx} bg="whiteAlpha.100" borderRadius="lg" p={4}>
                <Text fontSize="sm" color="gray.300" mb={3}>
                  {item.action}
                </Text>
                <HStack gap={2} flexWrap="wrap">
                  <Badge colorPalette="purple" size="sm">
                    +{item.points_gained} pts
                  </Badge>
                  <Badge colorPalette="gray" size="sm" textTransform="capitalize">
                    {item.difficulty}
                  </Badge>
                  <Badge colorPalette={item.breaking_change ? 'red' : 'green'} size="sm">
                    {item.breaking_change ? 'Breaking change' : 'Non-breaking'}
                  </Badge>
                  <Badge colorPalette="blue" size="sm">
                    {formatLabel(item.criterion)}
                  </Badge>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        <Separator />

        {/* What survives */}
        <Box>
          <Heading as="h2" size="md" mb={4} color={brandColors.accent}>
            What survives
          </Heading>
          <VStack gap={3} align="stretch">
            {report.what_survives.map((item, idx) => (
              <HStack key={idx} align="flex-start" gap={3}>
                <FiCheckCircle color="#4ade80" size={18} style={{ marginTop: 3, flexShrink: 0 }} />
                <Text fontSize="sm" color="gray.300">
                  {item}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Separator />

        {/* Evidence */}
        <Box>
          <Heading as="h2" size="md" mb={4} color={brandColors.accent}>
            Evidence
          </Heading>
          <VStack gap={2} align="stretch">
            {report.evidence.map((item, idx) => (
              <Text key={idx} fontSize="xs" color="gray.500" lineHeight="tall">
                {item}
              </Text>
            ))}
          </VStack>
        </Box>

        <Separator />

        {/* Notes */}
        <Box>
          <Heading as="h2" size="md" mb={3} color={brandColors.accent}>
            Notes
          </Heading>
          <Text fontSize="sm" color="gray.500" lineHeight="tall">
            {report.notes}
          </Text>
        </Box>
      </VStack>
    </Box>
  )
}
