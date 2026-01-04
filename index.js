import Whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth, List } = Whatsapp;


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote'
        ]
    }
});

let contacts = {};

const sections = [
    {
        title: "Escolha uma opção",
        rows: [
            { id: "info", title: "Informações sobre a BitSolution" },
            { id: "support", title: "Suporte Técnico" },
            { id: "sales", title: "Falar com Vendas" }
        ]
    }
];

const ListMessage = new List(
    "Por favor, escolha uma das opções abaixo:",
    "Selecione",
    sections,
    "Bem-Vindo à BitSolution Company"
);

client.on("qr", (qr) => {
    console.log("QR RECEIVED");
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", async (message) => {
    const { from, body } = message;
    console.log(`Message from ${from}: ${body}`);

    const contact = (contacts[from] || (contacts[from] = { state: 0 }));

    switch (contact.state) {
        case 0:
            await message.reply(`Olá! Bem-Vindo à BitSolution Company! Como podemos ajudar Você?`);
            await client.sendMessage(from, ListMessage);
            contact.state++;
            break;
    };
});

client.initialize();