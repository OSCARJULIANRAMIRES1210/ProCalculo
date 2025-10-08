// 🔹 Obtener nombres desde la URL
const params = new URLSearchParams(window.location.search);
const nombres = [
  params.get("j1") || "Jugador 1",
  params.get("j2") || "Jugador 2",
  params.get("j3") || "Jugador 3",
  params.get("j4") || "Jugador 4"
];

// 🔹 Referencias a los elementos del DOM
const botones = [
  document.getElementById("j1"),
  document.getElementById("j2"),
  document.getElementById("j3"),
  document.getElementById("j4")
];
const turnoTxt = document.getElementById("turno");
const tiempoTxt = document.getElementById("tiempo");
const letras = document.querySelectorAll(".letra");
const nuevaMesa = document.getElementById("nuevaMesa");

let tiempo = 0;
let jugadorActivo = null;
let intervalo = null;

// 🔹 Mostrar nombres en los botones
nombres.forEach((nombre, i) => {
  botones[i].textContent = nombre;
});

// 🔹 Iniciar tiempo global
function iniciarTiempo() {
  if (!intervalo) {
    intervalo = setInterval(() => {
      tiempo++;
      tiempoTxt.textContent = tiempo;
    }, 1000);
  }
}

// 🔹 Seleccionar jugador
botones.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    jugadorActivo = nombres[index];
    turnoTxt.textContent = `Turno de: ${jugadorActivo}`;
    iniciarTiempo();
  });
});

// 🔹 Agregar letra en los espacios
letras.forEach((letra) => {
  letra.addEventListener("click", () => {
    if (!jugadorActivo) {
      alert("Selecciona un jugador primero");
      return;
    }
    const caracter = prompt(`Turno de ${jugadorActivo}: escribe una letra`);
    if (caracter && caracter.length === 1) {
      letra.textContent = caracter.toUpperCase();
      letra.dataset.jugador = jugadorActivo;
      letra.dataset.tiempo = tiempo;
    }
  });
});

// 🔹 Nueva mesa (reiniciar juego)
nuevaMesa.addEventListener("click", () => {
 
  // Reinicia los valores por si acaso
  clearInterval(intervalo);
  jugadorActivo = null;
  tiempo = 0;

  // Redirigir al index.html
  window.location.href = "index.html";
});
