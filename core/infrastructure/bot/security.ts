export const verifyTelegramSecret = (req: Request): boolean => {
    const incomingToken = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
    const expectedToken = process.env.TELEGRAM_SECRET_TOKEN;
  
    // Si no hay token configurado en env, por seguridad rechazamos
    if (!expectedToken) return false;
  
    return incomingToken === expectedToken;
  };