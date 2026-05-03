import EmailQueue from "../models/emailQueue.js";
import { sendMail } from "../services/mailService.js";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function claimJob() {
    return EmailQueue.findOneAndUpdate(
        {
            status: "pending",
            attempts: { $lt: 5 }
        },
        {
            status: "processing",
            lockedAt: new Date()
        },
        {
            new: true
        }
    );
}

async function processJob(job) {
    try {
        await sendMail({
            to: job.to,
            subject: job.subject,
            html: job.html
        });

        job.status = "sent";
        await job.save();

        console.log("📨 sent:", job.to);

    } catch (err) {
        job.attempts += 1;
        job.lastError = err.message;
        job.status = job.attempts >= 5 ? "failed" : "pending";

        await job.save();

        console.log("❌ failed:", job.to);
    }
}

async function workerLoop() {
    console.log("📦 Email worker started");

    while (true) {
        try {
            const job = await claimJob();

            if (!job) {
                await sleep(3000); // нет задач → не грузим Mongo
                continue;
            }

            await processJob(job);

        } catch (err) {
            console.error("❌ Worker error:", err.message);
            await sleep(3000);
        }
    }
}

// 👇 ВАЖНО: экспортируем старт
export function startEmailWorker() {
    workerLoop();
}