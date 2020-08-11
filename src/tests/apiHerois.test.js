const assert = require('assert');
const api = require('./../api');
let app = {};

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGEiLCJpZCI6MSwiaWF0IjoxNTk3MTUyOTI5fQ.J4_s7L1UZ53E0lK3gh4rN1N15mWeqd8L6f1jqXS3xeg';

const headers = {
  Authorization: TOKEN
};

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder: 'Marreta Biônica'
};

const MOCK_HEROI_INICIAL = {
  nome: 'Gavião Negro',
  poder: 'Pontaria'
};

let MOCK_ID = '';

describe('Suite de testes da API Heroes', function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      url: '/herois',
      headers,
      payload: JSON.stringify(MOCK_HEROI_INICIAL)
    });
    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
  });

  it('listar /herois', async() => {
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/herois?skip=0&limit=10'
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it('listart /herois - deve retornar somente 10 registros', async() => {
    const TAMANHO_LIMITE = 10;
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
      headers
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados.length === TAMANHO_LIMITE);

  });

  it('listart /herois - deve retornar um erro com limit incorreto', async() => {
    const TAMANHO_LIMITE = 'AEE';
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
      headers
    });

    const errorResult = {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "\"limit\" must be a number",
      "validation": {
        "source": "query",
        "keys":["limit"]
      }
    };

    assert.deepEqual(result.statusCode, 400);
    assert.deepEqual(result.payload, JSON.stringify(errorResult));
  });

  it('listar GET /herois - deve filtrar um item', async() => {
    const NAME = MOCK_HEROI_INICIAL.nome;
    const result = await app.inject({
      method: 'GET',
      url: `/herois?skip=0&limit=1000&nome=${NAME}`,
      headers
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200)
    assert.deepEqual(dados[0].nome, NAME);
  });

  it('cadastar POST - /herois', async() => {
    const result = await app.inject({
      method: 'POST',
      url: `/herois`,
      headers,
      payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);
    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, 'Herói cadastrado com sucesso!');
  });

  it('atualizar PATCH - /herois/:id', async() => {
    const _id = MOCK_ID;
    const expected = { poder: 'Super Pontaria' };

    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${_id}`,
      headers,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
  
    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Herói atualizado com sucesso!');
  });

  it('atualizar PATCH - /herois/:id - não deve atualizar com ID incorreto!', async() => {
    const _id = `5f31c1c84f57b2393f306ece`;

    const result = await app.inject({
      method: 'PATCH',
      url: `/herois/${_id}`,
      headers,
      payload: JSON.stringify({ poder: 'Super Pontaria' })
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco!'
    };

    assert.ok(statusCode === 412);
    assert.deepEqual(dados, expected);
  });

  it('remover DELETE - /herois/:id', async() => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${_id}`,
      headers
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, 'Herói removido com sucesso!');
  });

  it('remover DELETE - /herois/:id não deve remover', async() => {
    const _id = '5f31c1c84f57b2393f306ece';
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${_id}`,
      headers
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Id não encontrado no banco!'
    };

    assert.ok(statusCode === 412);
    assert.deepEqual(dados, expected);
  });

  it('remover DELETE - /herois/:id não deve remover com id inválido', async() => {
    const _id = 'ID_INVALIDO';
    const result = await app.inject({
      method: 'DELETE',
      url: `/herois/${_id}`,
      headers
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);
    const expected = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    };

    assert.ok(statusCode === 500);
    assert.deepEqual(dados, expected);
  });
});