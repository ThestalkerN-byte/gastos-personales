import { webhookCallback } from "grammy";
import bot from "@/core/infrastructure/bot/bot";
import { verifyTelegramSecret } from "@/core/infrastructure/bot/security";

export const POST = async (req: Request) => {
    if(!verifyTelegramSecret(req)){
        return new Response("Unauthorized", { status: 401 })
    }
    return webhookCallback(bot, 'std/http')(req)
}