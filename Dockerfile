FROM node:22

# Dossier de travail dans le container
WORKDIR /app

# Copier les dépendances
COPY package*.json ./

# # Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Port utilisé par Vue (Vite = 5173 / Vue CLI = 8080)
EXPOSE 5173

# Lancer le serveur de dev
CMD ["npm", "run", "dev"]
