

export interface MailtrapConfig {
    apiToken?: string
    senderEmail?: string
    senderName: string
}

interface EmailOptions {
    to: string
    subject: string
    text?: string
    html?: string
}

const MAILTRAP_API_URL = 'https://send.api.mailtrap.io/api/send'


async function sendEmail(
    config: MailtrapConfig,
    options: EmailOptions
): Promise<{ success: boolean; error?: string }> {
    if (!config.apiToken || !config.senderEmail) {
        return { success: false, error: 'Mailtrap is not configured' }
    }

    try {
        const payload: Record<string, unknown> = {
            from: {
                email: config.senderEmail,
                name: config.senderName,
            },
            to: [{ email: options.to }],
            subject: options.subject,
            text: options.text,
            html: options.html,
        }

        
        if (options.subject.toLowerCase().includes('verify')) {
            payload.category = 'Account Verification'
        } else if (options.subject.toLowerCase().includes('password')) {
            payload.category = 'Password Reset'
        }

        const response = await fetch(MAILTRAP_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Mailtrap API error:', errorData)
            return {
                success: false,
                error: `Email send failed: ${response.status}`,
            }
        }

        return { success: true }
    } catch (err) {
        console.error('Mailtrap send error:', err)
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown email error',
        }
    }
}


export async function sendVerificationEmail(
    config: MailtrapConfig,
    to: string,
    username: string,
    verificationUrl: string
): Promise<{ success: boolean; error?: string }> {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #f4f4f4; color: #1a1a1a; margin: 0; padding: 0; line-height: 1.6; }
        .wrapper { background-color: #f4f4f4; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #ebebeb; border: 4px solid #1a1a1a; box-shadow: 8px 8px 0px rgba(0,0,0,0.1); }
        .header { background-color: #3c3c3c; color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #1a1a1a; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 32px 24px; text-align: center; }
        .greeting { font-size: 18px; margin-bottom: 16px; font-weight: bold; }
        .instruction { margin-bottom: 32px; color: #3c3c3c; }
        .button-wrapper { margin-bottom: 32px; }
        .button { display: inline-block; background: #ce422b; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border: 4px solid #1a1a1a; font-weight: bold; text-transform: uppercase; font-size: 14px; }
        .footer { background-color: #c6c6c6; padding: 24px; text-align: center; font-size: 12px; color: #3c3c3c; border-top: 4px solid #1a1a1a; }
        .expiry { font-weight: bold; color: #d32f2f; margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header"><h1>Cratery Quest</h1></div>
            <div class="content">
                <div class="greeting">Greetings, ${username}!</div>
                <div class="instruction">Click the button below to verify your email and unlock your account.</div>
                <div class="button-wrapper">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                <div class="expiry">This link expires in 15 minutes.</div>
            </div>
            <div class="footer">
                If you didn't create an account on Cratery, you can safely ignore this email.<br>
                &copy; 2026 Cratery
            </div>
        </div>
    </div>
</body>
</html>
    `.trim()

    const text = `
CRATERY - VERIFY YOUR EMAIL

Greetings, ${username}!

Verify your email by visiting:
${verificationUrl}

This link expires in 15 minutes.

If you didn't create an account on Cratery, you can safely ignore this email.
    `.trim()

    return sendEmail(config, {
        to,
        subject: 'Verify your account on Cratery',
        html,
        text,
    })
}


export async function sendPasswordResetEmail(
    config: MailtrapConfig,
    to: string,
    username: string,
    resetUrl: string
): Promise<{ success: boolean; error?: string }> {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #f4f4f4; color: #1a1a1a; margin: 0; padding: 0; line-height: 1.6; }
        .wrapper { background-color: #f4f4f4; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #ebebeb; border: 4px solid #1a1a1a; box-shadow: 8px 8px 0px rgba(0,0,0,0.1); }
        .header { background-color: #3c3c3c; color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #1a1a1a; }
        .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 32px 24px; text-align: center; }
        .greeting { font-size: 18px; margin-bottom: 16px; font-weight: bold; }
        .instruction { margin-bottom: 32px; color: #3c3c3c; }
        .button-wrapper { margin-bottom: 32px; }
        .button { display: inline-block; background: #ce422b; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border: 4px solid #1a1a1a; font-weight: bold; text-transform: uppercase; font-size: 14px; }
        .footer { background-color: #c6c6c6; padding: 24px; text-align: center; font-size: 12px; color: #3c3c3c; border-top: 4px solid #1a1a1a; }
        .expiry { font-weight: bold; color: #d32f2f; margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header"><h1>Password Reset</h1></div>
            <div class="content">
                <div class="greeting">Greetings, ${username}!</div>
                <div class="instruction">We received a request to reset your password. Click the button below to continue.</div>
                <div class="button-wrapper">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <div class="expiry">This link expires in 15 minutes.</div>
            </div>
            <div class="footer">
                If you didn't request a password reset, you can safely ignore this email.<br>
                &copy; 2026 Cratery
            </div>
        </div>
    </div>
</body>
</html>
    `.trim()

    const text = `
CRATERY - PASSWORD RESET

Greetings, ${username}!

Reset your password by visiting:
${resetUrl}

This link expires in 15 minutes.

If you didn't request a password reset, you can safely ignore this email.
    `.trim()

    return sendEmail(config, {
        to,
        subject: 'Reset your password on Cratery',
        html,
        text,
    })
}
