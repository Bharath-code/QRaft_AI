import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ScanAlertParams {
    userEmail: string;
    linkTitle: string;
    city: string;
    country: string;
    device: string;
    scannedAt?: Date;
}

export async function sendScanAlert(params: ScanAlertParams) {
    const { userEmail, linkTitle, city, country, device, scannedAt = new Date() } = params;

    try {
        const { data, error } = await resend.emails.send({
            from: "QRaft Alerts <alerts@qraft.ai>",
            to: userEmail,
            subject: `🎯 Your "${linkTitle}" QR was scanned!`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>QR Code Scanned</title>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">🎯 QR Code Scanned!</h1>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 16px; margin-bottom: 20px;">
                            Great news! Someone just scanned your <strong>${linkTitle}</strong> QR code.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                            <h3 style="margin-top: 0; color: #667eea;">Scan Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;"><strong>📍 Location:</strong></td>
                                    <td style="padding: 8px 0;">${city}, ${country}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;"><strong>📱 Device:</strong></td>
                                    <td style="padding: 8px 0;">${device}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;"><strong>⏰ Time:</strong></td>
                                    <td style="padding: 8px 0;">${scannedAt.toLocaleString()}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p style="margin: 0; font-size: 14px; color: #92400e;">
                                💡 <strong>Pro Tip:</strong> This could be a recruiter checking out your profile! Make sure your LinkedIn/portfolio is up to date.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard/links" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                                View Analytics Dashboard
                            </a>
                        </div>
                        
                        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                            This is an automated alert from QRaft.ai Recruiter Radar.<br>
                            You can manage your alerts in your <a href="${process.env.NEXT_PUBLIC_URL}/dashboard" style="color: #667eea;">dashboard</a>.
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error("Email send error:", error);
            return { success: false, error };
        }

        console.log("Scan alert email sent:", data);
        return { success: true, data };
    } catch (error) {
        console.error("Failed to send scan alert:", error);
        return { success: false, error };
    }
}
