'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Box, VStack, Heading, Text, HStack } from '@chakra-ui/react'
import { FiExternalLink } from 'react-icons/fi'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { useTranslation } from '@/hooks/useTranslation'
import { brandColors } from '@/theme'

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function WalkawayPage() {
  const t = useTranslation()
  const [url, setUrl] = useState('')
  const [touched, setTouched] = useState(false)

  const trimmedUrl = url.trim()
  const isInvalid = touched && trimmedUrl.length > 0 && !isValidUrl(trimmedUrl)
  const canSubmit = trimmedUrl.length > 0 && isValidUrl(trimmedUrl)

  const handleTest = () => {
    setTouched(true)
    if (!isValidUrl(trimmedUrl)) {
      return
    }

    toaster.create({
      title: t.walkaway.comingSoonTitle,
      description: t.walkaway.comingSoonDescription,
      type: 'info',
      duration: 4000,
    })
  }

  return (
    <Box maxW="container.md" mx="auto" py={20} px={4}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            {t.walkaway.title}
          </Heading>
          <Text fontSize="xl" color="gray.400" maxW="600px" mx="auto">
            {t.walkaway.explainer}
          </Text>
        </Box>

        <VStack gap={4} align="stretch" maxW="600px" mx="auto" w="full">
          <Field invalid={isInvalid} errorText={t.walkaway.invalidUrlError}>
            <Input
              aria-label={t.walkaway.title}
              value={url}
              onChange={e => setUrl(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleTest()
                }
              }}
              placeholder={t.walkaway.placeholder}
              type="url"
              size="lg"
              fontSize="lg"
              py={6}
            />
          </Field>

          <Button
            bg={brandColors.primary}
            color="white"
            _hover={{ bg: brandColors.secondary }}
            onClick={handleTest}
            disabled={!canSubmit}
            size="lg"
            alignSelf="center"
            px={10}
          >
            {t.walkaway.testButton}
          </Button>
        </VStack>

        <Box textAlign="center">
          <Link href="/walkaway/w3pk">
            <HStack justify="center" gap={1} color={brandColors.accent} display="inline-flex">
              <Text fontSize="sm">View sample report: w3pk</Text>
              <FiExternalLink size={14} />
            </HStack>
          </Link>
        </Box>

        <Box maxW="600px" mx="auto" w="full" pt={8} borderTop="1px solid" borderColor="gray.700">
          <Heading as="h2" size="md" mb={2}>
            {t.walkaway.whatIsTitle}
          </Heading>
          <Text color="gray.400">{t.walkaway.whatIsBody}</Text>
        </Box>
      </VStack>
    </Box>
  )
}
