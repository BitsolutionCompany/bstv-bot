import Whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import http from 'http';

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
  console.log("=================================================");
  console.log("📷 QR Code recebido. ESCANEIE O LOG RAPIDAMENTE:");
  qrcode.generate(qr, { small: true });
  console.log("=================================================");
});

client.on("ready", () => {
    console.log("✅ Cliente do WhatsApp está pronto!");
})

client.on("message", async (message) => {
    if (message.body === "!ping"){
        message.reply("!pong")
    }
})

client.on("auth_failure", (msg) => console.error("❌ Falha na Autenticação:", msg));

client.on("disconnected", (reason) => {
  console.error("🚫 Cliente desconectado. Tentando reconectar...", reason);
});

client.initialize();

const PORT = process.env.PORT || 8080;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WhatsApp Bot Worker is running.\n');
}).listen(PORT, () => {
  console.log(`Worker Webhook placeholder rodando na porta: ${PORT}`);
});