const { registerUser, loginUser } = require("../services/authService");

async function registerHandler(req, res) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { registerHandler, loginHandler };