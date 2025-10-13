import fetch from "node-fetch";

const API_KEY = "AIzaSyBNKMf03YvW5uvXcbUxfZsVEnQ0R8belJs";
const MODEL = "models/gemini-2.5-flash"; // o gemini-2.5-pro si quieres más calidad

async function generarTexto() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Escribe una carta formal solicitando permiso para ausentarse del trabajo por motivos personales."
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  console.log("Respuesta de Gemini:");
  console.log(data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data, null, 2));
}

generarTexto();
