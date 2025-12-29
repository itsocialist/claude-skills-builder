import { Resend } from 'resend'

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null

export interface SendEmailOptions {
    to: string
    subject: string
    html: string
    from?: string
    replyTo?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('[Email] Resend not configured - RESEND_API_KEY missing')
        return { success: false, error: 'Email service not configured' }
    }

    try {
        const { error } = await resend.emails.send({
            from: options.from || 'GetClaudeSkills <noreply@getclaudeskills.ai>',
            to: options.to,
            subject: options.subject,
            html: options.html,
            replyTo: options.replyTo,
        })

        if (error) {
            console.error('[Email] Send failed:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (err) {
        console.error('[Email] Send error:', err)
        return { success: false, error: 'Failed to send email' }
    }
}

// Email template helpers
const brandStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ededed; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { text-align: center; margin-bottom: 32px; }
  .logo { font-size: 24px; font-weight: 700; color: #C15F3C; }
  .content { background: #1a1a1a; border-radius: 12px; padding: 32px; margin-bottom: 24px; }
  h1 { color: #ededed; font-size: 24px; margin: 0 0 16px 0; }
  p { color: #a1a1a1; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; }
  .button { display: inline-block; background: #C15F3C; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
  .footer { text-align: center; color: #666; font-size: 12px; }
  .footer a { color: #888; }
`

function wrapTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${brandStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">GetClaudeSkills</div>
    </div>
    ${content}
    <div class="footer">
      <p>© ${new Date().getFullYear()} GetClaudeSkills</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export function getWelcomeEmailTemplate(skillName: string): { subject: string; html: string } {
    return {
        subject: `Your skill "${skillName}" is ready to use! 🎉`,
        html: wrapTemplate(`
      <div class="content">
        <h1>Welcome to GetClaudeSkills! 🎉</h1>
        <p>Your skill <strong>"${skillName}"</strong> has been downloaded successfully.</p>
        <p>Here's how to use it:</p>
        <ol style="color: #a1a1a1; margin: 16px 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Open Claude.ai and go to <strong>Projects</strong></li>
          <li style="margin-bottom: 8px;">Create a new project or open an existing one</li>
          <li style="margin-bottom: 8px;">Upload your SKILL.md file to Project Knowledge</li>
          <li style="margin-bottom: 8px;">Start chatting - Claude now has your skill!</li>
        </ol>
        <a href="https://getclaudeskills.ai/learn/installation-guide" class="button">View Full Guide →</a>
      </div>
    `)
    }
}

export function getTutorialEmailTemplate(skillName: string): { subject: string; html: string } {
    return {
        subject: `Get more from your "${skillName}" skill`,
        html: wrapTemplate(`
      <div class="content">
        <h1>Unlock the full potential of your skill 🚀</h1>
        <p>You downloaded <strong>"${skillName}"</strong> yesterday. Here are some tips to get even more value:</p>
        
        <h2 style="color: #ededed; font-size: 18px; margin-top: 24px;">💡 Pro Tips</h2>
        <ul style="color: #a1a1a1; margin: 16px 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Try giving Claude specific examples of what you want</li>
          <li style="margin-bottom: 8px;">Ask Claude to explain its reasoning for better results</li>
          <li style="margin-bottom: 8px;">Combine multiple skills in the same project for powerful workflows</li>
        </ul>
        
        <h2 style="color: #ededed; font-size: 18px; margin-top: 24px;">🎯 Want more skills?</h2>
        <p>Browse our marketplace for skills created by professionals in your industry.</p>
        
        <a href="https://getclaudeskills.ai/marketplace" class="button">Browse Marketplace →</a>
      </div>
    `)
    }
}

export function getSharePromptEmailTemplate(skillName: string): { subject: string; html: string } {
    return {
        subject: `Share "${skillName}" with your network`,
        html: wrapTemplate(`
      <div class="content">
        <h1>Loving your skill? Share the magic! ✨</h1>
        <p>You've been using <strong>"${skillName}"</strong> for a few days now.</p>
        <p>If it's helped you, why not share it with colleagues or friends who might benefit?</p>
        
        <div style="background: #252525; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; color: #ededed; font-style: italic;">
            "I just found this amazing tool that lets you create custom Claude skills in minutes. 
            Check it out: getclaudeskills.ai"
          </p>
        </div>
        
        <a href="https://twitter.com/intent/tweet?text=I%20just%20created%20a%20custom%20Claude%20skill%20in%20minutes%20with%20%40GetClaudeSkills!%20%F0%9F%9A%80&url=https%3A%2F%2Fgetclaudeskills.ai" class="button">Share on Twitter →</a>
        
        <p style="margin-top: 24px;">Or create another skill:</p>
        <a href="https://getclaudeskills.ai/app/wizard" class="button" style="background: #333;">Build Another Skill →</a>
      </div>
    `)
    }
}

// ============================================
// SEND HELPERS
// ============================================

export async function sendWelcomeEmail(to: string, skillName: string) {
    const template = getWelcomeEmailTemplate(skillName)
    return sendEmail({ to, ...template })
}

export async function sendTutorialEmail(to: string, skillName: string) {
    const template = getTutorialEmailTemplate(skillName)
    return sendEmail({ to, ...template })
}

export async function sendSharePromptEmail(to: string, skillName: string) {
    const template = getSharePromptEmailTemplate(skillName)
    return sendEmail({ to, ...template })
}
