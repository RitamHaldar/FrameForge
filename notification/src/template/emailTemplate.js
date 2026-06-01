/**
 * Premium email template for OTP Mail Verification.
 * Designed matching FrameForge's high-contrast, modern dark-mode aesthetic.
 * Utilizes email-safe HTML/CSS tables with inline styles for maximum cross-client compatibility (Gmail, Outlook, Apple Mail).
 *
 * @param {string} otp - The One-Time Password to be sent
 * @returns {string} The fully compiled HTML email template string
 */
export const getOtpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your Email - FrameForge</title>
  <style>
    /* Client-specific Styles */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }

    /* Reset Styles */
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0e0e0e; }

    /* iOS Blue Links Reset */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* Media Queries for Responsiveness */
    @media screen and (max-width: 525px) {
      .wrapper { width: 100% !important; max-width: 100% !important; }
      .responsive-table { width: 100% !important; }
      .padding { padding: 10px 5% 10px 5% !important; }
      .section-padding { padding: 0 15px 50px 15px !important; }
    }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; background-color: #0e0e0e; font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

  <!-- Main Container Background Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0e0e0e; min-height: 100vh;">
    <tr>
      <td align="center" valign="top">
        
        <!-- Spacing Top -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td height="40" style="font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
        </table>

        <!-- Main Content Card (MaxWidth 500px) -->
        <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table" style="background-color: #171717; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 48px rgba(0,0,0,0.5);">
          
          <!-- Accent Glowing Top Border (Violet/Indigo Gradient) -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #aa3bff, #6366f1); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Content Padding Area -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;" class="padding">
              
              <!-- Header / Logo -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- FrameForge Visual Premium Brand Text -->
                        <td style="font-family: 'Hanken Grotesk', system-ui, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
                          Frame<span style="color: #aa3bff;">Forge</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider Line -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px; margin-bottom: 25px;">
                <tr>
                  <td height="1" style="background-color: rgba(255, 255, 255, 0.06); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Main Body Text -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="font-family: 'Inter', system-ui, sans-serif; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 32px; letter-spacing: -0.01em;">
                    Verify your email address
                  </td>
                </tr>
                <tr>
                  <td height="16" style="font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <tr>
                  <td align="left" style="font-family: 'Inter', system-ui, sans-serif; font-size: 14px; font-weight: 400; color: #a1a1aa; line-height: 22px;">
                    Thank you for signing up for FrameForge. To finish setting up your account and activate your workspace, please use the One-Time Password (OTP) below:
                  </td>
                </tr>
              </table>

              <!-- OTP Code Display Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px; margin-bottom: 30px;">
                <tr>
                  <td align="center" style="background-color: rgba(170, 59, 255, 0.04); border: 1px dashed rgba(170, 59, 255, 0.35); border-radius: 12px; padding: 24px;">
                    <div style="font-family: 'JetBrains Mono', 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ffffff; line-height: 44px; text-shadow: 0 0 12px rgba(170, 59, 255, 0.4);">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Warning / Validity Notice -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" style="font-family: 'Inter', system-ui, sans-serif; font-size: 13px; font-weight: 400; color: #71717a; line-height: 20px;">
                    This OTP is valid for <strong style="color: #ffffff;">10 minutes</strong>. For security, never share this code with anyone.
                  </td>
                </tr>
                <tr>
                  <td height="12" style="font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <tr>
                  <td align="left" style="font-family: 'Inter', system-ui, sans-serif; font-size: 12px; font-weight: 400; color: #52525b; line-height: 18px; border-top: 1px solid rgba(255, 255, 255, 0.04); padding-top: 16px;">
                    If you did not request this, you can safely ignore this email. Your account remains secure.
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          
          <!-- Email Card Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #121212; border-top: 1px solid rgba(255, 255, 255, 0.04);" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 500; color: #52525b; line-height: 16px; letter-spacing: 0.02em;">
                    © ${new Date().getFullYear()} FrameForge Inc. All rights reserved.
                  </td>
                </tr>
                <tr>
                  <td height="4" style="font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
                <tr>
                  <td align="center" style="font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 400; color: #aa3bff; line-height: 16px;">
                    <a href="https://frameforge.io" target="_blank" style="color: #aa3bff; text-decoration: none; font-weight: 600;">Visit Platform</a>
                    <span style="color: #27272a; margin: 0 8px;">|</span>
                    <a href="https://frameforge.io/support" target="_blank" style="color: #aa3bff; text-decoration: none; font-weight: 600;">Support Helpdesk</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Footer / Workspace Attribution Below Card -->
        <table border="0" cellpadding="0" cellspacing="0" width="500" class="responsive-table" style="margin-top: 24px; margin-bottom: 40px;">
          <tr>
            <td align="center" style="font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 400; color: #3f3f46; line-height: 16px; text-align: center; padding: 0 20px;">
              You received this automated notification because a mail verification request was initiated on our platform.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};
