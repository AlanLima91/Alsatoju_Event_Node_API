const MatchingLib = require('../lib/Matching.lib')
const JwtMiddleware = require('../../services/Authentification.Service')

module.exports = function (app) {
  // GET /matchings
  app.get('/matchings', JwtMiddleware.isAuthenticated, MatchingLib.getAll)

  // GET /matchings/refresh
  app.get('/matchings/refresh', JwtMiddleware.isAuthenticated, MatchingLib.refresh)

  // GET /matchings/:id
  app.get('/matchings/:id', JwtMiddleware.isAuthenticated, MatchingLib.getMatch)

  // PATCH /matchings/:id
  app.patch('/matchings/:id', JwtMiddleware.isAuthenticated, MatchingLib.patchMatching)

  // DELETE /matchings/:id
  app.delete('/matchings/:id', JwtMiddleware.isAuthenticated, MatchingLib.deleteMatching)
}
