export type ContactEmailInput = {
  category: string
  company: string
  email: string
  fullName: string
  message: string
}

type ContactEmailMessage = {
  from: string
  html: string
  reply_to: string
  subject: string
  text: string
  to: string[]
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }

    return entities[character] ?? character
  })
}

function emailShell(
  content: string,
  previewText: string,
  status: string,
  brand: {logoUrl: string; siteUrl: string},
) {
  const safeLogoUrl = escapeHtml(brand.logoUrl)
  const safeSiteUrl = escapeHtml(brand.siteUrl)

  return `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#f5f4ef;color:#161719;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(previewText)}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#f5f4ef;">
          <tr>
            <td align="center" style="padding:48px 16px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #deddd7;border-top:4px solid #4169e1;">
                <tr>
                  <td style="padding:24px 32px;border-bottom:1px solid #e8e6df;background:#161719;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td width="44" valign="middle" style="width:44px;min-width:44px;max-width:44px;padding-right:13px;line-height:0;">
                                <img src="${safeLogoUrl}" width="44" height="44" alt="ITSEGHOSIME logo" style="display:block;width:44px !important;min-width:44px;max-width:44px;height:44px !important;border:0;border-radius:10px;-ms-interpolation-mode:bicubic;" />
                              </td>
                              <td valign="middle">
                                <p style="margin:0;color:#ffffff;font-size:14px;font-weight:800;letter-spacing:1.6px;line-height:1;text-transform:uppercase;">ITSEGHOSIME</p>
                                <p style="margin:7px 0 0;color:#aeb1b8;font-size:10px;font-weight:600;letter-spacing:1px;line-height:1;text-transform:uppercase;">Frontend developer · Software engineer</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td align="right" valign="middle" style="padding-left:16px;">
                          <span style="display:inline-block;padding:8px 10px;border:1px solid #4a4c50;color:#dce1ff;font-size:9px;font-weight:700;letter-spacing:1.2px;line-height:1;text-transform:uppercase;">${escapeHtml(status)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${content}
                <tr>
                  <td style="padding:24px 32px;border-top:1px solid #e8e6df;background:#faf9f4;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color:#6c727a;font-size:11px;line-height:1.6;">Thoughtful interfaces. Reliable engineering.</td>
                        <td align="right" style="padding-left:16px;font-size:11px;line-height:1.6;">
                          <a href="${safeSiteUrl}" style="color:#4169e1;font-weight:700;text-decoration:none;">View portfolio →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0;color:#8b8d91;font-size:10px;line-height:1.6;text-align:center;">Sent from the ITSEGHOSIME portfolio contact system.</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export function buildContactEmailBatch(
  input: ContactEmailInput,
  addresses: {fromEmail: string; siteUrl: string; toEmail: string},
): [ContactEmailMessage, ContactEmailMessage] {
  const {category, company, email, fullName, message} = input
  const {fromEmail, toEmail} = addresses
  const siteUrl = addresses.siteUrl.replace(/\/$/, '')
  const brand = {logoUrl: `${siteUrl}/apple-icon.png`, siteUrl: siteUrl || '/'}
  const firstName = fullName.split(/\s+/)[0] || 'there'
  const subjectName = fullName.replace(/[\r\n]+/g, ' ')
  const safeFullName = escapeHtml(fullName)
  const safeEmail = escapeHtml(email)
  const safeCategory = escapeHtml(category)
  const safeCompany = escapeHtml(company || 'Not supplied')
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')
  const safeFirstName = escapeHtml(firstName)

  const ownerEmail: ContactEmailMessage = {
    from: fromEmail,
    html: emailShell(
      `
        <tr>
          <td style="padding:44px 32px 36px;">
            <p style="margin:0 0 14px;color:#4169e1;font-size:10px;font-weight:800;letter-spacing:1.5px;line-height:1;text-transform:uppercase;">Contact <span style="color:#aeb1b8;">//</span> ${safeCategory}</p>
            <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:1.08;font-weight:400;letter-spacing:-0.8px;color:#161719;">A new conversation<br />has arrived.</h1>
            <p style="margin:0 0 30px;color:#6c727a;font-size:14px;line-height:1.65;">The essential details are organised below so you can assess and reply quickly.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e3e3de;font-size:14px;line-height:1.7;color:#383b40;">
              <tr><td style="width:92px;padding:13px 0;border-bottom:1px solid #e3e3de;color:#6c727a;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">From</td><td style="padding:13px 0;border-bottom:1px solid #e3e3de;"><strong style="color:#161719;">${safeFullName}</strong></td></tr>
              <tr><td style="width:92px;padding:13px 0;border-bottom:1px solid #e3e3de;color:#6c727a;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Email</td><td style="padding:13px 0;border-bottom:1px solid #e3e3de;">${safeEmail}</td></tr>
              <tr><td style="width:92px;padding:13px 0;border-bottom:1px solid #e3e3de;color:#6c727a;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Company</td><td style="padding:13px 0;border-bottom:1px solid #e3e3de;">${safeCompany}</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 40px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f4ef;border-left:3px solid #4169e1;">
              <tr>
                <td style="padding:24px 24px 26px;">
                  <p style="margin:0 0 11px;color:#6c727a;font-size:10px;font-weight:800;letter-spacing:1.2px;line-height:1;text-transform:uppercase;">Message</p>
                  <p style="margin:0;color:#303135;font-size:15px;line-height:1.75;">${safeMessage}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `,
      `New ${category.toLowerCase()} message from ${fullName}.`,
      'New contact',
      brand,
    ),
    reply_to: email,
    subject: `${category}: message from ${subjectName}`,
    text: [
      `From: ${fullName} (${email})`,
      `Category: ${category}`,
      `Company: ${company || 'Not supplied'}`,
      '',
      message,
    ].join('\n'),
    to: [toEmail],
  }

  const acknowledgementEmail: ContactEmailMessage = {
    from: fromEmail,
    html: emailShell(
      `
        <tr>
          <td style="padding:44px 32px 38px;">
            <p style="margin:0 0 14px;color:#4169e1;font-size:10px;font-weight:800;letter-spacing:1.5px;line-height:1;text-transform:uppercase;">Message received <span style="color:#aeb1b8;">//</span> Thank you</p>
            <h1 style="margin:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:1.08;font-weight:400;letter-spacing:-0.8px;color:#161719;">Thank you for reaching out, ${safeFirstName}.</h1>
            <p style="margin:0 0 16px;color:#383b40;font-size:16px;line-height:1.75;">Your message has reached me safely. I’ll review the details with care.</p>
            <p style="margin:0;color:#383b40;font-size:16px;line-height:1.75;">If the opportunity, collaboration, or project is a good fit, I’ll reply directly to this email with the next steps.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 40px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#dce1ff;">
              <tr>
                <td style="width:42px;padding:22px 0 22px 22px;color:#4169e1;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1;">✦</td>
                <td style="padding:22px;color:#26365f;font-size:13px;line-height:1.65;">
                  <strong style="color:#161719;">What happens next?</strong><br />
                  I’ll assess the context you shared and respond when there is a useful next step.
                </td>
              </tr>
            </table>
            <p style="margin:28px 0 0;color:#6c727a;font-size:13px;line-height:1.65;">
              Best,<br />
              <strong style="color:#161719;">Abdulrahman Itseghosime Bello</strong><br />
              Frontend Developer &amp; Software Engineer
            </p>
          </td>
        </tr>
      `,
      'Your message has reached Abdulrahman.',
      'Message received',
      brand,
    ),
    reply_to: toEmail,
    subject: 'Thanks for reaching out — ITSEGHOSIME',
    text: [
      `Hi ${firstName},`,
      '',
      'Thank you for reaching out through my portfolio. I’ve received your message and will review the details carefully.',
      '',
      'If the opportunity, collaboration, or project is a good fit, I’ll reply to this email with the next steps.',
      '',
      'Best,',
      'Abdulrahman Itseghosime Bello',
      'Frontend Developer & Software Engineer',
    ].join('\n'),
    to: [email],
  }

  return [ownerEmail, acknowledgementEmail]
}
