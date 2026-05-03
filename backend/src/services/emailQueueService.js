import EmailQueue from "../models/emailQueue.js";

export async function queueRegEmail(to, name, password) {
    await EmailQueue.create({
        to,
        subject: "Регистрация на платформе онлайн игр",
        html: `
            <h1>Здравствуйте, ${name}!</h1>
            <p>Ваш пароль: ${password}</p>
        `,
        status: "pending",
        attempts: 0,
    })
}