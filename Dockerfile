# Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia o package.json E a pasta prisma PRIMEIRO
# (Vamos criar o prisma a seguir, mas o Dockerfile já fica pronto)
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Gera o cliente Prisma
RUN npx prisma generate

# Copia o resto do código (src, etc.)
COPY . .

# Expõe a porta
EXPOSE 3000

# O comando 'command:' no docker-compose vai tratar de iniciar o servidor