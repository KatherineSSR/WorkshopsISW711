const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    const user = await User.findById(payload.userId);

    req.user = user;
    next();
  });
};

//JWT
const generateToken = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {userId:user._id, email: user.email};

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 

    return res.status(201).json({ token }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error generating token' });
  }
};

//endpoint de registro
const register = async (req, res) => {
  const { name, email, password } = req.body; //esta declarando variables al mismo tiempo pero en formato json para asignarselas al body del request

  if (!email || !password) {
    return res.status(400).json({ message: 'Se necesitan email y contraseña' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

module.exports = {
  authenticateToken,
  generateToken,
  register,
};