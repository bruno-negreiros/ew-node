const BaseRoute = require('./base/baseRoute');
const Joi = require('@hapi/joi');
const Boom = require('boom');

const failAction = (request, headers, erro) => {
  throw erro;
};

class HeroRoutes extends BaseRoute{
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      options: {
        tags: ['api'],
        description: 'Deve listar heróis',
        notes: 'Pode paginar resultados e filtrar por nome',
        validate: {
          failAction,
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          })
        }
      },
      handler: (request, header) => {
        try {
          const { skip, limit, nome } = request.query;

          let query = nome ? { nome: { $regex: `.*${nome}*.` } } : {};

          return this.db.read(query, parseInt(skip), parseInt(limit));
        } catch(error) {
          console.error('DEU RUIM', error);
          return Boom.internal();
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      options: {
        tags: ['api'],
        description: 'Deve cadastrar herói',
        notes: 'Deve cadastrar herói por nome e poder',
        validate: {
          failAction,
          payload: Joi.object({
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(3).max(100)
          })
        }
      },
      handler: async (request) => {
        try {
          const { nome, poder } = request.payload;
          const result = await this.db.create({ nome, poder });
          return { 
            message: 'Herói cadastrado com sucesso!',
            _id: result._id
          }
        } catch (error) {
          console.log('DEU RUIM', error);
          return Boom.internal();
        }
      }
    }
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      options: {
        tags: ['api'],
        description: 'Deve atualizar herói por id',
        notes: 'Pode atualizar qualquer campo',
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required()
          }),
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100)
          })
        }
      },
      handler: async (request) => {
        try {

          const { id } = request.params;
          const { payload } = request;
          const dadosString = JSON.stringify(payload);
          const dados = JSON.parse(dadosString);
          
          const result = await this.db.update(id, dados);

          if(result.nModified !== 1)  
            return Boom.preconditionFailed('Id não encontrado no banco!');

          return { message: 'Herói atualizado com sucesso!' };
          
        } catch(error) {
          console.error('DEU RUIM', error);
          return Boom.internal();
        }
      }
    }
  }

  delete() {
    return {
      path: '/herois/{id}',
      method: 'DELETE',
      options: {
        tags: ['api'],
        description: 'Deve remover herói por id',
        notes: 'O id tem que ser válido',
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required()
          })
        }
      },
      handler: async (request) => {
        try {

          const { id } = request.params;
          const result = await this.db.delete(id);

          if(result.n !== 1)  
            return Boom.preconditionFailed('Id não encontrado no banco!');

          return { message: 'Herói removido com sucesso!' };

        } catch(error) {
          console.log('DEU RUIM', error);
          return Boom.internal();
        }
      }
    }
  }
}

module.exports = HeroRoutes;