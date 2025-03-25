/**
 * Configuration du proxy de développement pour React
 * Permet de rediriger les requêtes API vers le serveur backend pendant le développement
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Rediriger les requêtes /api/* vers le serveur backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001', // Adresse du serveur backend
      changeOrigin: true,
      secure: false, // Ne pas vérifier les certificats SSL en développement
      pathRewrite: {
        '^/api': '/api', // Conserver le préfixe /api
      },
      // Journalisation des requêtes
      logLevel: 'debug',
    })
  );
};
