import request from 'supertest';
import { expect } from 'chai';
import env from '../helpers/env.js';
import { loginComoAdmin } from '../helpers/auth.js';
import { criarAluno } from '../helpers/fabricaDados.js';

describe('[ Externo ] Cadastro de aluno', () => {
  before(async () => {
    try {
      const respostaDaApi = await request(env.baseUrl).get('/');
      expect(respostaDaApi.status).to.equal(200);
    } catch (erro) {
      throw new Error(`Não foi possível acessar a API em ${env.baseUrl}. Inicie a aplicação com "npm start".`);
    }
  });

  it('deve fazer login como administrador e cadastrar um aluno', async () => {
    const respostaLoginAdmin = await loginComoAdmin(env.baseUrl);

    expect(respostaLoginAdmin.status).to.equal(200);
    expect(respostaLoginAdmin.body.token).to.be.a('string').and.not.be.empty;
    expect(respostaLoginAdmin.body.usuario.role).to.equal('admin');

    const aluno = criarAluno();
    const respostaCadastroAluno = await request(env.baseUrl)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${respostaLoginAdmin.body.token}`)
      .send(aluno);

    expect(respostaCadastroAluno.status).to.equal(201);
    expect(respostaCadastroAluno.body.nome).to.equal(aluno.nome);
    expect(respostaCadastroAluno.body.email).to.equal(aluno.email);
    expect(respostaCadastroAluno.body.matricula).to.equal(aluno.matricula);
    expect(respostaCadastroAluno.body.id).to.be.a('string').and.not.be.empty;
  });
});
