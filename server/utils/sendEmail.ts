import { Resend } from 'resend';

// TEMPORARY: Email system disabled during development
const EMAIL_DISABLED = true;

function getCredentials() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error('Resend credentials not configured. Please set RESEND_API_KEY and RESEND_FROM_EMAIL environment variables.');
  }

  return { apiKey, fromEmail };
}

function getResendClient() {
  const { apiKey, fromEmail } = getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}

/**
 * Send an email using Resend
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param htmlContent - HTML content of the email
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; error?: string }> {
  // TEMPORARY: Email disabled during development
  if (EMAIL_DISABLED) {
    console.log('📧 Email system temporarily disabled — would send:', {
      to,
      subject,
      emailType: subject.includes('Verify') ? 'verification' : 
                 subject.includes('Password') ? 'password_reset' : 
                 'notification'
    });
    return { success: true };
  }

  try {
    const { client, fromEmail } = getResendClient();

    const result = await client.emails.send({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    console.log('✅ Email sent successfully:', {
      to,
      subject,
      emailId: result.data?.id,
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send email:', {
      to,
      subject,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}
