import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendTutorialEmail, sendSharePromptEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { type, email, skillName } = body

        if (!email || !skillName) {
            return NextResponse.json(
                { error: 'Missing required fields: email, skillName' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        let result
        switch (type) {
            case 'welcome':
                result = await sendWelcomeEmail(email, skillName)
                break
            case 'tutorial':
                result = await sendTutorialEmail(email, skillName)
                break
            case 'share':
                result = await sendSharePromptEmail(email, skillName)
                break
            default:
                return NextResponse.json(
                    { error: 'Invalid email type. Use: welcome, tutorial, or share' },
                    { status: 400 }
                )
        }

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send email' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[API] Email send error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
