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

export async function queueRecoveryEmail(to, name, recoveryLink) {
    await EmailQueue.create({
        to,
        subject: "Вы запросили ссылку для восстановления пароля",
        html: `
            <h1>Здравствуйте, ${name}!</h1>
            <p>Вы запросили ссылку для восстановления пароля.</p>
            <p>
                <a href="${recoveryLink}">
                    Восстановить пароль по ссылке
                </a>
            </p>
            <p style="color: red">Ссылка действует только 30 минут!</p>
            <p>Если это были не Вы — просто проигнорируйте письмо.</p>
        `,
        status: "pending",
        attempts: 0,
    })
}