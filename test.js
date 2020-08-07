const { deepEqual } = require('assert');
const database = require('./database.js');

const DEFAULT_ITEM_CADASTRAR = {
  nome: 'Flash',
  poder: 'Speed',
  id: 1
};

const DEFAULT_ITEM_ATUALIZAR = {
  nome: 'Lanterna Verde',
  poder: 'Energia do Anel',
  id: 2
};

describe('Suite de manipulação de Heróis', () => {
  before(async () => {
    await database.cadastrar(DEFAULT_ITEM_CADASTRAR);
    await database.cadastrar(DEFAULT_ITEM_ATUALIZAR);
  });

  it('deve pesquisar um herói usando arquivos', async () => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const [resultado] = await database.listar(expected.id); //pegar só o objeto da primeiro posição

    deepEqual(resultado, expected);
  });
  
  it('deve cadastrar um herói, usando arquivos', async() => {
    const expected = DEFAULT_ITEM_CADASTRAR;
    const resultado = await database.cadastrar(expected);
    const [atual] = await database.listar(expected.id);

    deepEqual(atual, expected);
  });

  it('deve remover um herói por id', async() => {
    const expected = true;
    const resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id);
    deepEqual(resultado, expected);
  });

  it.only('deve atualizar im herói pelo id', async () => {
    const expected = {
      ...DEFAULT_ITEM_ATUALIZAR,
      nome: 'Batman',
      poder: 'Dinheiro'
    };

    const novoDado = {
      nome: 'Batman',
      poder: 'Dinheiro'
    };

    await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado);
    const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id);
    deepEqual(resultado, expected);
  });
});