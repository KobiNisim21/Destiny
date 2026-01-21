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
const getEmailTemplate = (content, unsubscribeLink = "") => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; background-color: #f9f9f9; padding: 20px; color: #333;">
    <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">DESTINY</h1>
        </div>
        
        <div style="padding: 40px 30px; line-height: 1.6; text-align: right;">
            ${content}
        </div>

        <div style="background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Destiny. כל הזכויות שמורות.</p>
            ${unsubscribeLink ? `
                <p style="margin-top: 10px;">
                    <a href="${unsubscribeLink}" style="color: #9F19FF; text-decoration: underline;">הסר מרשימת תפוצה</a>
                </p>
            ` : ''}
        </div>
    </div>
  </div>
`;

export const sendWelcomeEmail = async (email, firstName) => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const content = `
          <h1 style="color: #333;">היי ${firstName}, ברוכים הבאים!</h1>
          <p>אנחנו שמחים שהצטרפת לקהילה שלנו.</p>
          <p>ביצעת הרשמה מוצלחת לאתר Destiny.</p>
          <p>תהנו מהקנייה!</p>
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
          <h1 style="color: #333;">ביקשת לאפס את הסיסמה?</h1>
          <p>לחץ על הקישור למטה כדי לבחור סיסמה חדשה:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #9F19FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">אפס סיסמה</a>
          </div>
          <p>אם לא ביקשת לאפס סיסמה, ניתן להתעלם ממייל זה.</p>
        `;

        const fullHtml = getEmailTemplate(content);

        const info = await transporter.sendMail({
            from: '"Destiny Shop" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'איפוס סיסמה - דסטני',
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
          <h1 style="color: #333;">הודעה חדשה מטופס צור קשר</h1>
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>אימייל:</strong> ${email}</p>
          ${phone ? `<p><strong>טלפון:</strong> ${phone}</p>` : ''}
          <p><strong>תוכן ההודעה:</strong></p>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
        `;

        const fullHtml = getEmailTemplate(content);

        const info = await transporter.sendMail({
            from: '"Destiny Shop Contact" <' + process.env.EMAIL_USER + '>',
            to: process.env.EMAIL_USER, // Send to admin
            replyTo: email,
            subject: `הודעה חדשה מהאתר: ${name}`,
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

        let htmlContent = body.replace('{{couponCode}}', `
            <div style="margin: 30px 0; text-align: center;">
                <div style="background: #f3e8ff; border: 2px dashed #9F19FF; color: #9F19FF; display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 2px; border-radius: 8px;">
                    ${couponCode}
                </div>
                <p style="font-size: 14px; color: #666; margin-top: 10px;">השתמשו בקוד זה בעת התשלום</p>
            </div>
        `);

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
        const fullHtml = getEmailTemplate(body, unsubscribeLink);

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
            <h2 style="color: #1a1a1a; margin-top: 0; text-align: center;">אימות כתובת אימייל</h2>
            <p style="text-align: center;">תודה שנרשמת לניוזלטר של Destiny!</p>
            <p style="text-align: center;">כדי להשלים את ההרשמה ולקבל את קוד הקופון שלך, אנא לחץ על הכפתור למטה:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background-color: #9F19FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">אמת אימייל</a>
            </div>
            <p style="font-size: 14px; color: #888; text-align: center;">אם לא נרשמת לאתר, ניתן להתעלם ממייל זה.</p>
        `;

        const fullHtml = getEmailTemplate(content); // No unsubscribe needed yet

        const info = await transporter.sendMail({
            from: '"Destiny Team" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'Destiny - אימות הרשמה לניוזלטר',
            html: fullHtml
        });
        console.log('Verification email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};
