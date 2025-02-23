import { NextRequest, NextResponse } from 'next/server'

const RUKH_API_URL = 'https://rukh.w3hc.org'

interface RukhResponse {
  network: string
  model: string
  txHash: string
  explorerLink: string
  output: string
  sessionId: string
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: NextRequest) {
  console.log('📝 Incoming request:', {
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
  })

  try {
    const body = await request.json()
    const { message, sessionId, context } = body

    if (!message) {
      console.warn('❌ Missing message in request body')
      return NextResponse.json(
        {
          message: 'Message is required',
          receivedBody: body,
        },
        { status: 400 }
      )
    }

    const payload = {
      message,
      context: context || 'rukh',
      sessionId: sessionId || '12345',
    }

    console.log('📡 Sending request to Rukh API...', {
      url: RUKH_API_URL,
      payload,
    })

    const response = await fetch(RUKH_API_URL + '/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('🔍 Rukh API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Rukh API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      // Handle rate limit specifically
      if (response.status === 429) {
        return NextResponse.json(
          {
            message: 'Sorry, you reached the limit. Please come back in one hour.',
            error: 'RATE_LIMIT_EXCEEDED',
            status: 429,
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          message: `Rukh API error: ${response.status} ${response.statusText}`,
          error: errorText,
        },
        { status: response.status }
      )
    }

    const data: RukhResponse = await response.json()
    console.log('✅ Rukh API response received:', {
      sessionId: data.sessionId,
      txHash: data.txHash,
      model: data.model,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Error in API handler:', {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
