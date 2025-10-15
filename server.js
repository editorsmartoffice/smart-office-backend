import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔑 Clave de Gemini cargada:", process.env.GEMINI_API_KEY ? "✅ Sí" : "❌ No");

// ✅ Ruta raíz para Render (muestra mensaje si visitas la URL base)
app.get("/", (req, res) => {
  res.send("✅ Smart Office Backend funcionando correctamente en Render");
});

// 🧾 Ruta para generar carta
app.post("/api/generar-carta", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await result.json();
    console.log("📨 Respuesta de Gemini (carta):", JSON.stringify(data, null, 2));

    const textoCarta = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const htmlCarta = textoCarta
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");

    res.json({ carta: htmlCarta });
  } catch (error) {
    console.error("❌ Error al generar carta:", error);
    res.status(500).json({ error: "Error generando la carta", detalle: error.message });
  }
});

// 🧾 Ruta para generar oficio
app.post("/api/generar-oficio", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await result.json();
    console.log("📨 Respuesta de Gemini (oficio):", JSON.stringify(data, null, 2));

    const textoOficio = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const htmlOficio = textoOficio
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");

    res.json({ oficio: htmlOficio });
  } catch (error) {
    console.error("❌ Error al generar oficio:", error);
    res.status(500).json({ error: "Error generando el oficio", detalle: error.message });
  }
});

// ✉️ Ruta para generar correo
app.post("/api/generar-correo", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await result.json();
    console.log("📨 Respuesta de Gemini (correo):", JSON.stringify(data, null, 2));

    const textoCorreo = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const htmlCorreo = textoCorreo
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");

    res.json({ correo: htmlCorreo });
  } catch (error) {
    console.error("❌ Error al generar correo:", error);
    res.status(500).json({ error: "Error generando el correo", detalle: error.message });
  }
});

// 🚀 Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
