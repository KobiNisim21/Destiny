import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email Service Error: Missing EMAIL_USER or EMAIL_PASS');
            return null;
        }

        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify connection configuration only once
        transporter.verify(function (error, success) {
            if (error) {
                console.log('Nodemailer connection error:', error);
            } else {
                console.log('Server is ready to take our messages (Nodemailer)');
            }
        });
    }
    return transporter;
};

// Helper for HTML template
const getEmailTemplate = (content, unsubscribeLink = "") => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const logoUrl = `${baseUrl}/destiny-logo-new.png`;

    return `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; background-color: #f9f9f9; padding: 20px; color: #333;">
    <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #000000; padding: 20px; text-align: center;">
            <img src="${logoUrl}" alt="DESTINY" style="max-height: 50px; object-fit: contain;" />
        </div>
        
        <div style="padding: 40px 30px; line-height: 1.6; text-align: right; color: #333333;">
            ${content}
        </div>

        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Destiny. כל הזכויות שמורות.</p>
            <p style="margin: 5px 0 0 0;">
                <a href="${baseUrl}" style="color: #666666; text-decoration: none;">מעבר לאתר</a>
            </p>
            ${unsubscribeLink ? `
                <p style="margin-top: 15px;">
                    <a href="${unsubscribeLink}" style="color: #9F19FF; text-decoration: underline;">הסר מרשימת תפוצה</a>
                </p>
            ` : ''}
        </div>
    </div>
  </div>
`;
};

export const sendWelcomeEmail = async (email, firstName) => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const content = `
          <h1 style="color: #1a1a1a; margin-top: 0;">היי ${firstName}, איזה כיף שהצטרפת!</h1>
          <p>ברוכים הבאים לקהילת Destiny.</p>
          <p>ההרשמה שלך עברה בהצלחה, ועכשיו נשאר רק להתחיל לגלוש ולבחור את הפריטים שאת/ה הכי אוהב/ת.</p>
          <p style="margin-top: 20px;">תהנו מהקנייה!</p>
        `;

        const fullHtml = getEmailTemplate(content);

        const info = await transporter.sendMail({
            from: '"Destiny Shop" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'ברוכים הבאים לדסטני! ✨',
            html: fullHtml,
        });
        console.log('Email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const content = `
          <h1 style="color: #1a1a1a; margin-top: 0;">איפוס סיסמה</h1>
          <p>ביקשת לאפס את הסיסמה לחשבון שלך? אין בעיה.</p>
          <p>לחץ על הכפתור למטה כדי לבחור סיסמה חדשה:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #9F19FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(159, 25, 255, 0.3);">אפס סיסמה</a>
          </div>
          <p style="font-size: 14px; color: #666;">אם לא ביקשת לאפס סיסמה, ניתן להתעלם ממייל זה.</p>
        `;

        const fullHtml = getEmailTemplate(content);

        const info = await transporter.sendMail({
            from: '"Destiny Shop" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'איפוס סיסמה - Destiny',
            html: fullHtml,
        });
        console.log('Email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};

export const sendContactEmail = async (name, email, message, phone = '') => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const content = `
          <h2 style="color: #1a1a1a; margin-top: 0;">הודעה חדשה מהאתר</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0 0 10px 0;"><strong>שם הצור קשר:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong>אימייל:</strong> ${email}</p>
              ${phone ? `<p style="margin: 0 0 10px 0;"><strong>טלפון:</strong> ${phone}</p>` : ''}
              <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
              <p style="margin: 0;"><strong>תוכן ההודעה:</strong></p>
              <p style="margin-top: 5px; white-space: pre-wrap;">${message}</p>
          </div>
        `;

        const fullHtml = getEmailTemplate(content);

        const info = await transporter.sendMail({
            from: '"Destiny Shop Contact" <' + process.env.EMAIL_USER + '>',
            to: process.env.EMAIL_USER, // Send to admin
            replyTo: email,
            subject: `פנייה חדשה: ${name}`,
            html: fullHtml
        });
        console.log('Contact email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};

export const sendNewsletterWelcome = async (email, subject, body, couponCode, subscriberId) => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        let htmlContent = body;

        const couponHtml = `
            <div style="margin: 40px 0; text-align: center;">
                <div style="background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); border: 2px dashed #9F19FF; color: #9F19FF; display: inline-block; padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(159, 25, 255, 0.1);">
                    <div style="font-size: 14px; color: #666; margin-bottom: 5px;">הנה המתנה שלך:</div>
                    <div style="font-size: 28px; font-weight: 800; letter-spacing: 3px; font-family: monospace;">${couponCode}</div>
                    <div style="font-size: 13px; color: #888; margin-top: 5px;">יש להזין את הקוד בעגלת הקניות</div>
                </div>
            </div>
        `;

        // Either replace placeholder OR append if exists
        if (htmlContent.includes('{{couponCode}}')) {
            htmlContent = htmlContent.replace('{{couponCode}}', couponHtml);
        } else if (couponCode) {
            htmlContent += couponHtml;
        }

        // Add ID if provided
        const unsubscribeLink = subscriberId ? `${baseUrl}/unsubscribe?id=${subscriberId}` : "";
        const fullHtml = getEmailTemplate(htmlContent, unsubscribeLink);

        const info = await transporter.sendMail({
            from: '"Destiny Team" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: subject || 'ברוכים הבאים ל-Destiny!',
            html: fullHtml,
        });
        console.log('Newsletter welcome email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};

export const sendCampaignEmail = async (email, subject, body, subscriberId) => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        const unsubscribeLink = subscriberId ? `${baseUrl}/unsubscribe?id=${subscriberId}` : "";

        // Wrap body in paragraph if it looks like plain text
        let processedBody = body;
        if (!body.trim().startsWith('<')) {
            processedBody = `<p>${body.replace(/\n/g, '<br>')}</p>`;
        }

        const fullHtml = getEmailTemplate(processedBody, unsubscribeLink);

        const info = await transporter.sendMail({
            from: '"Destiny Shop" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: subject,
            html: fullHtml,
        });
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};

export const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        const verificationLink = `${baseUrl}/verify?token=${token}`;

        const content = `
            <h2 style="color: #1a1a1a; margin-top: 0; text-align: center; font-size: 24px;">רק עוד צעד קטן...</h2>
            <p style="text-align: center; font-size: 16px; color: #555;">תודה שנרשמת לניוזלטר של Destiny!</p>
            <p style="text-align: center; margin-bottom: 30px; color: #555;">כדי להשלים את ההרשמה ולקבל את ההטבה שלך, לחץ על הכפתור למטה:</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationLink}" style="background-color: #9F19FF; color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 10px 20px rgba(159, 25, 255, 0.2);">אמתו את המייל שלי</a>
            </div>
            
            <p style="font-size: 13px; color: #999; text-align: center; margin-top: 40px;">אם לא נרשמת לאתר, ניתן להתעלם ממייל זה בבטחה.</p>
        `;

        const fullHtml = getEmailTemplate(content);

        const info = await transporter.sendMail({
            from: '"Destiny Team" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'אמת את המייל שלך - Destiny',
            html: fullHtml
        });
        console.log('Verification email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};

export const sendOrderConfirmationEmail = async (email, firstName, orderId, items, totalAmount) => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

        const itemsHtml = items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div style="flex: 1;">
                    <strong style="color: #333;">${item.name}</strong>
                    <div style="font-size: 14px; color: #666;">כמות: ${item.quantity} </div>
                </div>
                <div style="font-weight: bold;">
                    ₪${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');

        const content = `
            <h1 style="color: #1a1a1a; margin-top: 0; text-align: center;">תודה על ההזמנה, ${firstName}! ✨</h1>
            <p style="text-align: center; color: #666; font-size: 16px;">ההזמנה שלך התקבלה בהצלחה ומעובדת ברגעים אלו.</p>
            
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #9F19FF; padding-bottom: 10px; display: inline-block;">סיכום הזמנה #${orderId.slice(-6).toUpperCase()}</h3>
                
                ${itemsHtml}
                
                <div style="margin-top: 20px; text-align: left; font-size: 18px; font-weight: bold; color: #9F19FF;">
                    סה"כ לתשלום: ₪${totalAmount.toFixed(2)}
                </div>
            </div>

            <p style="text-align: center; margin-top: 30px;">
                <a href="${baseUrl}/orders" style="background-color: #1a1a1a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">לצפייה בהזמנה באתר</a>
            </p>
            
            <p style="text-align: center; font-size: 14px; color: #888; margin-top: 30px;">
                אם יש לך שאלות נוספות, אנחנו כאן לכל דבר ועניין.
            </p>
        `;

        const fullHtml = getEmailTemplate(content);

        const info = await transporter.sendMail({
            from: '"Destiny Orders" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: `אישור הזמנה #${orderId.slice(-6).toUpperCase()} - Destiny`,
            html: fullHtml,
        });

        console.log('Order confirmation email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};
