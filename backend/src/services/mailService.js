import nodemailer from "nodemailer"

export function createTransporter() {
    return nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    })
}

export async function sendMail({ to, subject, html }) {
    const transporter = createTransporter()

    return transporter.sendMail({
        from: `"Центр Психологии и Тренинга Марии Минаковой" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    })
}