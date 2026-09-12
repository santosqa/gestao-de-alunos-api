import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';
import db from '../../src/database/db.js';
import { loginComoAdmin } from '../helpers/auth.js';
import { criarAluno } from '../helpers/fabricaDados.js';

describe('[ Interno ] Cadastro de aluno', () => {
  let alunoId;

  after(() => {
    db.remove('alunos', alunoId);
  });

  it('deve fazer login como administrador e cadastrar um aluno', async () => {
    const respostaLoginAdmin = await loginComoAdmin(app);

    expect(respostaLoginAdmin.status).to.equal(200);
    expect(respostaLoginAdmin.body.token).to.be.a('string').and.not.be.empty;
    expect(respostaLoginAdmin.body.usuario.role).to.equal('admin');

    const aluno = criarAluno();
    const respostaCadastroAluno = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${respostaLoginAdmin.body.token}`)
      .send(aluno);

    expect(respostaCadastroAluno.status).to.equal(201);
    expect(respostaCadastroAluno.body.nome).to.equal(aluno.nome);
    expect(respostaCadastroAluno.body.email).to.equal(aluno.email);
    expect(respostaCadastroAluno.body.matricula).to.equal(aluno.matricula);
    expect(respostaCadastroAluno.body.id).to.be.a('string').and.not.be.empty;

    alunoId = respostaCadastroAluno.body.id;
  });
});
