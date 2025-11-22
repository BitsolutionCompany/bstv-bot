import Whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = Whatsapp;

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './session' }),
  puppeteer: { 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  },
});

client.on("qr", (qr) => {
  console.log("📷 QR Code recebido, gerando no terminal...");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Clinet is on!")
})

client.on("message", async (message) => {
    if (message.body === "!ping"){
        message.reply("!pong")
    }
})

client.on("auth_failure", () => console.error("Falha na Autenticação"))

client.initialize()