const BaseRoute = require('./base/baseRoute');
const Joi = require('@hapi/joi');

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
          failAction: (request, headers, erro) => {
            throw erro;
          },
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
}

module.exports = HeroRoutes;