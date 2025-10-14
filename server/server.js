// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // si usas Node 18+, puedes usar global fetch y quitar esta dependencia

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MODEL = process.env.GEN_MODEL || 'gemini-2.5-flash';
const API_KEY = process.env.GEN_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ No se encontró GEN_API_KEY en .env - configura tu API key de Google AI Studio');
}

app.post('/api/generateCarta', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Falta prompt en el body' });

    // URL REST (puede variar según versión; aquí usamos la forma común)
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/${MODEL}:generateText`;

    const body = {
      // El formato puede variar por versión del API; este es el formato básico:
      prompt: { text: prompt },
      // Opcionales:
      maxOutputTokens: 1024
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // A veces se usa ?key=API_KEY en la URL; aquí usamos Authorization Bearer.
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // extraer texto de la respuesta robustamente (las propiedades cambian entre versiones)
    let text = '';
    if (data.candidates && data.candidates.length) {
      const c = data.candidates[0];
      // varios formatos posibles:
      if (typeof c.output === 'string') text = c.output;
      else if (c.content) {
        // c.content puede ser array de fragmentos
        if (Array.isArray(c.content)) {
          text = c.content.map(part => part.text || JSON.stringify(part)).join('');
        } else {
          text = JSON.stringify(c.content);
        }
      } else {
        text = JSON.stringify(c);
      }
    } else if (data.output) {
      // fallback
      text = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
    } else {
      text = JSON.stringify(data);
    }

    return res.json({ result: text, raw: data });
  } catch (err) {
    console.error('Error llamando a Gemini:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server arrancado en http://localhost:${PORT}`);
});
