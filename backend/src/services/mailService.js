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

export async function sendRegEmail(to, name, password) {
    const transporter = createTransporter()

    return transporter.sendMail({
        from: `"Центр Психологии и Тренинга Марии Минаковой" <${process.env.SMTP_USER}>`,
        to,
        subject: "Регистрация на платформе онлайн игр",
        html: `
            <h1>Здравствуйте, ${name}!</h1>
            <p>Вы успешно зарегистрировались на сайте https://igra-psy.ru/</p>
            <p>Ваш пароль: ${password}</p>
            <p>Если Вы не регистрировались, просто проигнорируйте данное письмо</p>
        `,
    })
}