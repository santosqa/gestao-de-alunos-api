import { faker } from '@faker-js/faker';

export function criarAluno() {
  const codigoDoAluno = faker.string.alphanumeric(10).toLowerCase();

  return {
    nome: faker.person.fullName(),
    email: `aluno.${codigoDoAluno}@teste.com`,
    matricula: faker.string.numeric(8),
    senha: faker.internet.password({ length: 8, prefix: 'Aa1' }),
  };
}

export function criarDisciplina(caso) {
  const codigoDaDisciplina = faker.string.alphanumeric(6).toUpperCase();

  return {
    nome: caso.nomeDisciplina,
    codigo: `AUT-${codigoDaDisciplina}`,
    cargaHoraria: caso.cargaHoraria,
  };
}

export function criarTrabalho(caso, disciplinaId) {
  return {
    disciplinaId,
    titulo: caso.tituloTrabalho,
    descricao: caso.descricaoTrabalho,
  };
}
