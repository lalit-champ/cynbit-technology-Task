const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, branch, year, linkedin, github } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO table23 (name, email, password, branch, year, linkedin, github)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, hashedPassword, branch, year, linkedin, github]
    );
    res.status(201).json({ message: 'User registered', user: newUser.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query(`SELECT * FROM table23 WHERE email = $1`, [email]);
    if (!user.rows.length) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token, user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
