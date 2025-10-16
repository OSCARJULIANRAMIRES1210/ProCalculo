// ----------------------
// Referencias del DOM
// ----------------------
const turnoTxt = document.getElementById("turno");
const tiempoTxt = document.getElementById("tiempo");
const letras = document.querySelectorAll(".letra");
const nuevaMesa = document.getElementById("nuevaMesa");
const botones = [
  document.getElementById("j1"),
  document.getElementById("j2"),
  document.getElementById("j3"),
  document.getElementById("j4")
];
const finalizarJuego = document.getElementById("finalizarJuego");

// ----------------------
// Variables de estado
// ----------------------
let jugadorActivo = null;
let tiempo = 0;
let intervalo = null;
let letrasCompletadas = 0;

// Palabra correcta a adivinar
const respuestaCorrecta = "PLANETA"; // <-- Cámbiala o carga dinámicamente si usas una DB

// ----------------------
// Obtener datos del grupo y jugadores desde URL
// ----------------------
const params = new URLSearchParams(window.location.search);
const grupo = params.get("grupo") || "—";
const nombres = [
  params.get("j1") || "",
  params.get("j2") || "",
  params.get("j3") || "",
  params.get("j4") || ""
];

// ----------------------
// Mostrar nombres en pantalla
// ----------------------
nombres.forEach((nombre, i) => {
  if (nombre) {
    botones[i].textContent = nombre;
  } else {
    botones[i].style.display = "none";
  }
});

// ----------------------
// Mostrar guiones según la longitud de la palabra
// ----------------------
letras.forEach((el, i) => {
  if (i < respuestaCorrecta.length) {
    el.textContent = "_";
    el.style.display = "inline-block";
  } else {
    el.style.display = "none";
  }
});

// ----------------------
// Iniciar y detener tiempo
// ----------------------
function iniciarTiempo() {
  if (!intervalo) {
    intervalo = setInterval(() => {
      tiempo++;
      tiempoTxt.textContent = tiempo;
    }, 1000);
  }
}

function detenerTiempo() {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }
}

// ----------------------
// Selección de jugador único
// ----------------------
botones.forEach(btn => {
  btn.addEventListener("click", () => {
    if (jugadorActivo) {
      alert(`Ya está jugando: ${jugadorActivo}`);
      return;
    }

    jugadorActivo = btn.textContent;
    turnoTxt.textContent = `Turno de: ${jugadorActivo}`;
    iniciarTiempo();

    // Visual
    botones.forEach(b => b.classList.remove("jugador-activo"));
    btn.classList.add("jugador-activo");

    // Deshabilitar los demás
    botones.forEach(b => {
      if (b !== btn) b.disabled = true;
    });
  });
});

// ----------------------
// Juego: clic en letra
// ----------------------
letras.forEach((letraEl, index) => {
  letraEl.addEventListener("click", () => {
    if (!jugadorActivo) {
      alert("Selecciona un jugador primero");
      return;
    }

    if (letraEl.textContent !== "_") {
      alert("Esta letra ya fue completada");
      return;
    }

    const entrada = prompt(`Letra para la posición ${index + 1}:`);
    if (!entrada || entrada.length !== 1) return;

    const letra = entrada.toUpperCase();
    const correcta = respuestaCorrecta[index] === letra;

    if (correcta) {
      letraEl.textContent = letra;
      letraEl.classList.add("ok");
      letrasCompletadas++;
    } else {
      letraEl.classList.add("error");
      alert("Letra incorrecta");
    }

    // Si se completa la palabra
    if (letrasCompletadas === respuestaCorrecta.length) {
      detenerTiempo();

      alert(`¡Correcto! Jugador: ${jugadorActivo}\nGrupo: ${grupo}\nTiempo: ${tiempo} segundos`);

      // Guardar en localStorage
      const resultado = {
        grupo,
        jugador: jugadorActivo,
        tiempo,
        palabra: respuestaCorrecta,
        fecha: new Date().toISOString()
      };

      const juegos = JSON.parse(localStorage.getItem("juegos") || "[]");
      juegos.push(resultado);
      localStorage.setItem("juegos", JSON.stringify(juegos));
    }
  });
});

// ----------------------
// Reiniciar juego
// ----------------------
nuevaMesa.addEventListener("click", () => {
  detenerTiempo();
  window.location.href = "index.html";
});
