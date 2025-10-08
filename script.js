const equations = ["∫x²dx", "E=mc²", "ΣF=ma", "∂/∂x", "π≈3.1416", "Δv/Δt", "∇·E=ρ/ε₀"];

for (let i = 0; i < 15; i++) {
  const el = document.createElement('div');
  el.className = 'equation';
  el.textContent = equations[Math.floor(Math.random() * equations.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.animationDuration = (8 + Math.random() * 8) + 's';
  el.style.fontSize = (16 + Math.random() * 20) + 'px';
  document.body.appendChild(el);
}



const boton = document.getElementById("btnIniciar");

function iniciarJuego() {
  // Capturar nombres
  const j1 = document.getElementById("jugador1").value.trim();
  const j2 = document.getElementById("jugador2").value.trim();
  const j3 = document.getElementById("jugador3").value.trim();
  const j4 = document.getElementById("jugador4").value.trim();

  // Validar que al menos haya un nombre
  if (!j1 && !j2 && !j3 && !j4) {
    

    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Por favor, ingresa al menos un nombre.",
  
  });
    return;
  }

  // Crear la URL con parámetros
  const url = `juego.html?j1=${encodeURIComponent(j1)}&j2=${encodeURIComponent(j2)}&j3=${encodeURIComponent(j3)}&j4=${encodeURIComponent(j4)}`;

  // Redirigir a la nueva página
  window.location.href = url;
}

boton.addEventListener("click", iniciarJuego);
