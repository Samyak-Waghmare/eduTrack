import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
    try {
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            return { success: true, messageId: "mock-" + Date.now() };
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"LMS Platform" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        return { success: false, error };
    }
};

export const getWelcomeEmailTemplate = (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Welcome to LMS Platform, ${name}!</h2>
        <p style="color: #374151; font-size: 16px;">We are thrilled to have you join our learning community. Get ready to explore top-tier courses and level up your skills!</p>
        <div style="margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Browse Courses</a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 40px;">If you have any questions, simply reply to this email.</p>
    </div>
`;

export const getReceiptEmailTemplate = (name, courseName, amount) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
        <h2 style="color: #10b981;">Purchase Successful!</h2>
        <p style="color: #374151; font-size: 16px;">Hi ${name}, thank you for your purchase.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #4b5563;"><strong>Course:</strong> ${courseName}</p>
            <p style="margin: 10px 0 0 0; color: #4b5563;"><strong>Total Paid:</strong> ₹${amount}</p>
        </div>
        <p style="color: #374151; font-size: 16px;">You can access your course immediately from your learning dashboard.</p>
        <div style="margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-learning" style="background: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Learning</a>
        </div>
    </div>
`;

export const getCertificateEmailTemplate = (name, courseName) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
        <h2 style="color: #f59e0b;">Congratulations, ${name}! 🏆</h2>
        <p style="color: #374151; font-size: 16px;">You have successfully completed <strong>${courseName}</strong>. Your hard work and dedication have paid off.</p>
        <p style="color: #374151; font-size: 16px;">Your certificate of completion is now available on your dashboard.</p>
        <div style="margin-top: 30px;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background: #f59e0b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Certificate</a>
        </div>
    </div>
`;
