import request from 'supertest';
import env from './env.js';

export async function loginComoAdmin(aplicacao) {
  const resposta = await request(aplicacao)
    .post('/api/auth/login')
    .send({
      email: env.adminEmail,
      senha: env.adminSenha,
    });

  return resposta;
}

export async function loginComoAluno(aplicacao, aluno) {
  const resposta = await request(aplicacao)
    .post('/api/auth/login')
    .send({
      email: aluno.email,
      senha: aluno.senha,
    });

  return resposta;
}
