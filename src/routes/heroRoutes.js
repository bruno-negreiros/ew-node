const BaseRoute = require('./base/baseRoute');
const Joi = require('@hapi/joi');

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
          return 'Erro interno no servidor';
        }
      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      options: {
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
          return 'Internal Error';
        }
      }
    }
  }

  update() {
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      options: {
        validate: {
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
            return { message: 'Não foi possível atualizar!' };

          return { message: 'Herói atualizado com sucesso!' };
          
        } catch(error) {
          console.error('DEU RUIM', error);
          return 'Erro interno!';
        }
      }
    }
  }
}

module.exports = HeroRoutes;