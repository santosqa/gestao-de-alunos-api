import dotenv from 'dotenv';

// Procura o arquivo .env na raiz do projeto, para não expor dados sensíveis.
dotenv.config({ quiet: true });

if (!process.env.BASE_URL) {
  throw new Error('Configure a variável BASE_URL no arquivo .env ou no GitHub Secrets.');
}

if (!process.env.ADMIN_EMAIL) {
  throw new Error('Configure a variável ADMIN_EMAIL no arquivo .env ou no GitHub Secrets.');
}

if (!process.env.ADMIN_SENHA) {
  throw new Error('Configure a variável ADMIN_SENHA no arquivo .env ou no GitHub Secrets.');
}

const env = {
  baseUrl: process.env.BASE_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminSenha: process.env.ADMIN_SENHA,
};

export default env;
