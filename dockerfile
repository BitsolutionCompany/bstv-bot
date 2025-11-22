# Usa a imagem oficial do Node.js 18
FROM node:20-slim

# Instala as dependências de sistema necessárias para o Puppeteer (Chromium)
# Estas são as bibliotecas essenciais para rodar o navegador em modo headless
RUN apt-get update && \
    apt-get install -y \
    wget \
    gnupg \
    procps \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgconf-2-4 \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libgdk-pixbuf2.0-0 \
    libjpeg-dev \
    libxss1 \
    libpangocairo-1.0-0 \
    libgbm-dev && \
    rm -rf /var/lib/apt/lists/*

# Cria e define o diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o código da aplicação
COPY . .

# Comando de inicialização
CMD ["npm", "start"]