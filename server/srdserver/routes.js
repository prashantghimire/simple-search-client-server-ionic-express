var httpVerbs = require('./models/httpVerbs');

module.exports = {
  configure: function(app) {
    // Get Verb
    app.get('/api/:tablename', function(req, res) {
      httpVerbs.get(req.params.tablename, res);
    });
  }
};