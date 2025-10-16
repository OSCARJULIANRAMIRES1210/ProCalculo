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
let letrasIngresadas = Array.from(letras).fill("_");
let juegoFinalizado = false;

// Palabra correcta a adivinar
const respuestaCorrecta = "PLANETA"; // <-- puedes cambiarla

// ----------------------
// Obtener datos del grupo y jugadores desde URL
// ----------------------
const params = new URLSearchParams(window.location.search);
const grupo = params.get("grupo") || "—";
document.getElementById("nombreGrupo").textContent = grupo;
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
// Tiempo
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
// Selección de jugador (sin iniciar tiempo todavía)
// ----------------------
botones.forEach(btn => {
  btn.addEventListener("click", () => {
    if (jugadorActivo) {
      alert(`Ya está jugando: ${jugadorActivo}`);
      return;
    }

    jugadorActivo = btn.textContent;
    turnoTxt.textContent = `Turno de: ${jugadorActivo}`;

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

let letraActual = 0;
document.addEventListener("keydown", (e) => {
  if (juegoFinalizado) return;
  if (!jugadorActivo) return;
  if (letraActual >= respuestaCorrecta.length) return;
  const key = e.key.toUpperCase();
  if (key.length === 1 && key.match(/[A-ZÑÁÉÍÓÚÜ]/)) {
    if (!intervalo) iniciarTiempo();
    letrasIngresadas[letraActual] = key;
    letras[letraActual].textContent = key;
    letraActual++;
    letrasCompletadas++;
    if (letrasCompletadas === respuestaCorrecta.length) {
      detenerTiempo();
      juegoFinalizado = true;
      setTimeout(mostrarResultadoFinal, 300); // Espera breve antes de mostrar ventana
    }
  }
});

// ----------------------
// Mostrar resultado final
// ----------------------
function mostrarResultadoFinal() {
  letras.forEach((letraEl, index) => {
    const correcta = respuestaCorrecta[index] === letrasIngresadas[index];
    if (correcta) {
      letraEl.classList.add("ok"); // verde
    } else {
      letraEl.classList.add("error"); // rojo
    }
  });

  const aciertos = letrasIngresadas.filter(
    (l, i) => l === respuestaCorrecta[i]
  ).length;

  // Mostrar resultado debajo del tiempo
  const listaRegistros = document.getElementById("lista-registros");
  let letrasHTML = "";
  for (let i = 0; i < respuestaCorrecta.length; i++) {
    const letra = letrasIngresadas[i] || "_";
    if (letra === respuestaCorrecta[i]) {
      letrasHTML += `<span style='color: #3cff7a; font-weight:bold;'>${letra}</span>`;
    } else {
      letrasHTML += `<span style='color: #ff3c3c; font-weight:bold;'>${letra}</span>`;
    }
  }
  listaRegistros.innerHTML = `
    <div class="registro-item">
      <strong>Juego terminado</strong><br>
      <span class="registro-meta">Jugador: ${jugadorActivo}</span><br>
      <span class="registro-meta">Grupo: ${grupo}</span><br>
      <span class="registro-meta">Aciertos: ${aciertos}/${respuestaCorrecta.length}</span><br>
      <span class="registro-meta">Tiempo: ${tiempo} segundos</span><br>
      <span class="registro-meta">Palabra: ${respuestaCorrecta}</span><br>
      <span class="registro-meta">Letras: ${letrasHTML}</span>
    </div>
  `;

  // Guardar en localStorage
  const posiciones = [];
  for (let i = 0; i < respuestaCorrecta.length; i++) {
    posiciones.push({
      letra: letrasIngresadas[i],
      correcta: letrasIngresadas[i] === respuestaCorrecta[i],
      posicion: i + 1
    });
  }
  const resultado = {
    grupo,
    jugador: jugadorActivo,
    tiempo,
    palabra: respuestaCorrecta,
    ingresadas: letrasIngresadas.join(""),
    posiciones,
    fecha: new Date().toISOString(),
  };

  const juegos = JSON.parse(localStorage.getItem("juegos") || "[]");
  juegos.push(resultado);
  localStorage.setItem("juegos", JSON.stringify(juegos));
}

// ----------------------
// Reiniciar juego
// ----------------------
nuevaMesa.addEventListener("click", () => {
  detenerTiempo();
  window.location.href = "index.html";
});
