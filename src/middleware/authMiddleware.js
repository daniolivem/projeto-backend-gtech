const jwt = require('jsonwebtoken');


/**
 * Middleware para proteger rotas com autenticação JWT são: POST, PUT, DELETE.
 */

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Só aplica a validação se for uma rota que requer autenticação (POST, PUT, DELETE)
 const method = req.method.toUpperCase();
 if (['POST', 'PUT', 'DELETE'].includes(method)) {
    const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Token de autenticação ausente ou inválido.' });
  }

  // Extrai o token JWT do cabeçalho
  const token = authHeader.split(' ')[1];

  try {
    // Verificar e decodificar o token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // Armazenar informações do usuário no req.user para uso futuro
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro na autenticação JWT:', error);
    return res.status(400).json({ message: 'Token de autenticação inválido ou expirado.' });
  }

  } else {
    // Se não for uma rota que requer autenticação, apenas continue para o 
    // próximo middleware ou rota (rota do tip GET ou outra método)
    next();
  }
}

module.exports = authMiddleware;

