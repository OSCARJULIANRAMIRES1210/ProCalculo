// Limpieza defensiva: eliminar cualquier ecuación ya inyectada
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.equation').forEach(el => el.remove());
});
async function iniciarJuego() {
  const j1 = document.getElementById("jugador1").value.trim();
  const j2 = document.getElementById("jugador2").value.trim();
  const j3 = document.getElementById("jugador3").value.trim();
  const j4 = document.getElementById("jugador4").value.trim();
  const grupo = (document.getElementById("grupo")?.value || "").trim();

  if (!j1 && !j2 && !j3 && !j4) {
    Swal.fire({ icon: "error", title: "Oops...", text: "Por favor, ingresa al menos un nombre." });
    return;
  }

  // Obtener pregunta seleccionada desde localStorage
  const preguntaId = localStorage.getItem("preguntaActivaId") || null;
  const jugadores = [j1 || "", j2 || "", j3 || "", j4 || ""];

  // Crear mesa en la base de datos
  const mesaId = await DB.addMesa({
    grupo,
    jugadores,
    preguntaId: preguntaId ? Number(preguntaId) : null,
    inicio: Date.now(),
    tiempoTotal: null,
    jugadorQueJugo: null
  });

  // Redirigir al juego
  const url = `juego.html?mesaId=${mesaId}`;
  window.location.href = url;
}

// Inicialización
document.getElementById("btnIniciar").addEventListener("click", iniciarJuego);

// Botón de datos (abre el CRUD)
document.getElementById("btnDatos").addEventListener("click", () => {
  window.location.href = "datos.html";
});

const boton = document.getElementById("btnIniciar");

async function iniciarJuego() {
  // Capturar nombres
  const j1 = document.getElementById("jugador1").value.trim();
  const j2 = document.getElementById("jugador2").value.trim();
  const j3 = document.getElementById("jugador3").value.trim();
  const j4 = document.getElementById("jugador4").value.trim();
  const grupo = (document.getElementById("grupo")?.value || "").trim();

  // Validar que al menos haya un nombre
  if (!j1 && !j2 && !j3 && !j4) {
    

    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Por favor, ingresa al menos un nombre.",
  
  });
    return;
  }

  const preguntaId = localStorage.getItem("preguntaActivaId") || null;
  const jugadores = [j1, j2, j3, j4];

  const mesaId = await DB.addMesa({
    grupo,
    jugadores,
    preguntaId: preguntaId ? Number(preguntaId) : null,
    inicio: Date.now(),
    tiempoTotal: null,
    jugadorQueJugo: null
  });
  // Crear la URL con parámetros
  const url = `juego.html?j1=${encodeURIComponent(j1)}&j2=${encodeURIComponent(j2)}&j3=${encodeURIComponent(j3)}&j4=${encodeURIComponent(j4)}`;

  // Redirigir a la nueva página
  window.location.href = `juego.html?mesaId=${mesaId}`;
}

boton.addEventListener("click", iniciarJuego);
