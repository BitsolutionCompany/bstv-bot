import Whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// Importe a classe Buttons junto com as outras
const { Client, LocalAuth, Buttons } = Whatsapp;

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

// 1. Defina os botões (eles não usam "sections")
const buttons = [
    { id: "info", body: "Informações sobre a BitSolution" },
    { id: "support", body: "Suporte Técnico" },
    { id: "sales", body: "Falar com Vendas" }
];

// 2. Crie o objeto Buttons em vez de List
const ButtonMessage = new Buttons(
    "Por favor, escolha uma das opções abaixo:", // Corpo principal da mensagem
    buttons,                                     // Array de botões definidos acima
    "Bem-Vindo à BitSolution Company",           // Título (opcional, pode ser string vazia)
    "Rodapé (opcional)"                          // Rodapé (opcional, pode ser string vazia)
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
            // ESTADO 0: Primeiro contato, envia a mensagem de boas-vindas e os BOTÕES.
            await message.reply(`Olá! Bem-Vindo à BitSolution Company! Como podemos ajudar Você?`);
            // Envie a mensagem de botão
            await client.sendMessage(from, ButtonMessage);
            contact.state = 1; 
            break;
        
        case 1:
            // ESTADO 1: O usuário já recebeu os botões e agora está respondendo.
            // Para botões, a resposta vem no 'message.selectedButtonId'
            const selectedOptionId = message.selectedButtonId;

            if (selectedOptionId === "info") {
                await client.sendMessage(from, "A BitSolution é uma empresa focada em soluções de software inovadoras. Visite nosso site!");
            } else if (selectedOptionId === "support") {
                await client.sendMessage(from, "Para suporte técnico, por favor, envie um e-mail para suporte@bitsolution.com.");
            } else if (selectedOptionId === "sales") {
                await client.sendMessage(from, "Um de nossos consultores de vendas entrará em contato em breve.");
            } else {
                await client.sendMessage(from, "Opção inválida. Por favor, use um dos botões abaixo.");
                return; 
            }

            contact.state = 0; 
            break;
    };
});

client.initialize();
