'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Container, Box, Button, Flex, Input, VStack, Text, useToast, Link } from '@chakra-ui/react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'
import { useAppKitAccount } from '@reown/appkit/react'

interface Message {
  text: string
  isUser: boolean
  txHash?: string
  explorerLink?: string
}

interface ChatMessageProps {
  message: string
  isUser: boolean
  txHash?: string
  explorerLink?: string
}

interface RukhResponse {
  network: string
  model: string
  txHash: string
  explorerLink: string
  output: string
  sessionId: string
}

const MarkdownComponents = {
  p: (props: any) => (
    <Text mb={2} lineHeight="tall" color="inherit">
      {props.children}
    </Text>
  ),
  code: ({ inline, className, children }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    return inline ? (
      <Text as="code" px={1} bg="gray.700" borderRadius="sm" fontSize="0.875em">
        {children}
      </Text>
    ) : (
      <Box my={4}>
        <SyntaxHighlighter
          language={match ? match[1] : ''}
          style={tomorrow}
          customStyle={{ borderRadius: '8px' }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </Box>
    )
  },
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, txHash, explorerLink }) => (
  <Box w="full" py={4}>
    <Container maxW="container.md" px={4}>
      <Box color={isUser ? '#45a2f8' : 'white'}>
        {isUser ? (
          <Text whiteSpace="pre-wrap">{message}</Text>
        ) : (
          <>
            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
              {message}
            </ReactMarkdown>
            {txHash && explorerLink && (
              <Link
                href={explorerLink}
                isExternal
                color="#8c1c84"
                fontSize="sm"
                mt={2}
                display="block"
              >
                {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </Link>
            )}
          </>
        )}
      </Box>
    </Container>
  </Box>
)

export default function Chat() {
  const toast = useToast()
  const { address } = useAppKitAccount()

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMessages([
      {
        text: `Hello! You can ask any question about the future of Ethereum, upcoming upgrades, how you can contribute, etc. Enjoy!`,
        isUser: false,
      },
    ])
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) {
      return
    }

    const userMessage: Message = {
      text: inputValue,
      isUser: true,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    console.log('user address:', address)
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: 'etherverse',
          sessionId: sessionId || '',
          address: address || '0x5c527b6950F9FF2144eD138bCB1adDE703f81Af3',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (errorData.status === 429) {
          const rateMessage: Message = {
            text: errorData.message,
            isUser: false,
          }
          setMessages(prev => [...prev, rateMessage])
          return
        }

        throw new Error(errorData.message || `API error: ${response.status}`)
      }

      const data: RukhResponse = await response.json()
      setSessionId(data.sessionId)

      const assistantMessage: Message = {
        text: data.output,
        isUser: false,
        txHash: data.txHash,
        explorerLink: data.explorerLink,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling API:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response from Rukh',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      const errorMessage: Message = {
        text: 'Sorry, there was an error processing your request. Please try again a bit later.',
        isUser: false,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Box minH="calc(100vh - 80px)" display="flex" flexDirection="column" bg="black">
      <Box flex="1" overflowY="auto" px={4}>
        <Container maxW="container.md" h="full" px={0}>
          <VStack spacing={0} align="stretch">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isUser={message.isUser}
                txHash={message.txHash}
                explorerLink={message.explorerLink}
              />
            ))}
            {isTyping && (
              <Box p={0}>
                <Container maxW="container.md" mx="auto">
                  <Image priority width="120" height="120" alt="loader" src="/loader.svg" />
                </Container>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Container>
      </Box>

      <Box as="form" onSubmit={handleSubmit} p={4}>
        <Container maxW="container.md" mx="auto">
          <Flex gap={2}>
            <Input
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              placeholder="What can I do to help Ethereum thrive?"
              size="lg"
              borderColor="gray.700"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: 'none',
              }}
            />
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isDisabled={!inputValue.trim() || isTyping}
            >
              Send
            </Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
