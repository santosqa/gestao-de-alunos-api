import request from 'supertest';
import { expect } from 'chai';
import env from '../helpers/env.js';
import { loginComoAdmin, loginComoAluno } from '../helpers/auth.js';
import { criarAluno, criarDisciplina, criarTrabalho } from '../helpers/fabricaDados.js';

describe('[ Externo ] Entrega de trabalho', () => {
  let aluno;
  let alunoId;
  let disciplinaId;

  const massa = {
    nomeDisciplina: 'Automação de Testes',
    cargaHoraria: 60,
    tituloTrabalho: 'Projeto de testes de API',
    descricaoTrabalho: 'Entrega criada durante o teste automatizado.',
  };

  before(async () => {
    try {
      const respostaDaApi = await request(env.baseUrl).get('/');
      expect(respostaDaApi.status).to.equal(200);
    } catch (erro) {
      throw new Error(`Não foi possível acessar a API em ${env.baseUrl}. Inicie a aplicação com "npm start".`);
    }

    const respostaLoginAdmin = await loginComoAdmin(env.baseUrl);

    expect(respostaLoginAdmin.status).to.equal(200);
    expect(respostaLoginAdmin.body.token).to.be.a('string').and.not.be.empty;
    const tokenAdmin = respostaLoginAdmin.body.token;

    aluno = criarAluno();
    const respostaAluno = await request(env.baseUrl)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(aluno);
    expect(respostaAluno.status).to.equal(201);
    expect(respostaAluno.body.id).to.be.a('string').and.not.be.empty;
    alunoId = respostaAluno.body.id;

    const disciplina = criarDisciplina(massa);
    const respostaDisciplina = await request(env.baseUrl)
      .post('/api/admin/disciplinas')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(disciplina);
    expect(respostaDisciplina.status).to.equal(201);
    expect(respostaDisciplina.body.id).to.be.a('string').and.not.be.empty;
    disciplinaId = respostaDisciplina.body.id;

    const respostaMatricula = await request(env.baseUrl)
      .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ alunoId });
    expect(respostaMatricula.status).to.equal(201);
    expect(respostaMatricula.body.id).to.be.a('string').and.not.be.empty;
  });

  it('deve fazer login como aluno e registrar uma entrega', async () => {
    const respostaLoginAluno = await loginComoAluno(env.baseUrl, aluno);

    expect(respostaLoginAluno.status).to.equal(200);
    expect(respostaLoginAluno.body.token).to.be.a('string').and.not.be.empty;
    expect(respostaLoginAluno.body.usuario.role).to.equal('aluno');

    const trabalho = criarTrabalho(massa, disciplinaId);
    const respostaEntrega = await request(env.baseUrl)
      .post(`/api/alunos/${alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${respostaLoginAluno.body.token}`)
      .send(trabalho);

    expect(respostaEntrega.status).to.equal(201);
    expect(respostaEntrega.body.alunoId).to.equal(alunoId);
    expect(respostaEntrega.body.disciplinaId).to.equal(disciplinaId);
    expect(respostaEntrega.body.titulo).to.equal(trabalho.titulo);
    expect(respostaEntrega.body.status).to.equal('entregue');
  });
});
