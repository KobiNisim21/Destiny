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

export const sendWelcomeEmail = async (email, firstName) => {
    try {
        const transporter = getTransporter();
        if (!transporter) throw new Error('Email service not initialized');

        const mailOptions = {
            from: '"Destiny Shop" <' + process.env.EMAIL_USER + '>', // Sender address
            to: email,
            subject: 'ברוכים הבאים לדסטני! ✨',
            html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">
          <h1>היי ${firstName}, ברוכים הבאים!</h1>
          <p>אנחנו שמחים שהצטרפת לקהילה שלנו.</p>
          <p>ביצעת הרשמה מוצלחת לאתר Destiny.</p>
          <p>תהנו מהקנייה!</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
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

        const mailOptions = {
            from: '"Destiny Shop" <' + process.env.EMAIL_USER + '>',
            to: email,
            subject: 'איפוס סיסמה - דסטני',
            html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">
          <h1>ביקשת לאפס את הסיסמה?</h1>
          <p>לחץ על הקישור למטה כדי לבחור סיסמה חדשה:</p>
          <a href="${resetLink}" style="background-color: #9F19FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">אפס סיסמה</a>
          <p>אם לא ביקשת לאפס סיסמה, ניתן להתעלם ממייל זה.</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, data: info };

    } catch (err) {
        console.error('Email service error:', err);
        return { success: false, error: err };
    }
};
