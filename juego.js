// 🔹 Obtener nombres desde la URL
const params = new URLSearchParams(window.location.search);
const nombres = [
  params.get("j1") || "Jugador 1",
  params.get("j2") || "Jugador 2",
  params.get("j3") || "Jugador 3",
  params.get("j4") || "Jugador 4"
];

// 🔹 Referencias a los elementos del DOM
const jugadores = [
  document.getElementById("j1"),
  document.getElementById("j2"),
  document.getElementById("j3"),
  document.getElementById("j4")
];
const turnoTxt = document.getElementById("turno");
const tiempoTxt = document.getElementById("tiempo");
const letras = document.querySelectorAll(".letra");
const nuevaMesa = document.getElementById("nuevaMesa");
const finalizarJuego = document.getElementById("finalizarJuego");
const listaRegistros = document.getElementById("lista-registros");

let tiempo = 0;
let jugadorActivo = null;
let indiceJugadorActivo = 0;
let intervalo = null;
let juegoIniciado = false;
let casillaActual = 0;
let registrosJugadores = [];
let todosJugaron = false;

// 🔹 Mostrar nombres en los jugadores
nombres.forEach((nombre, i) => {
  jugadores[i].textContent = nombre;
  jugadores[i].classList.add("jugador-disponible");
});

// 🔹 Iniciar tiempo cuando el jugador comience a jugar
function iniciarTiempo() {
  if (!intervalo) {
    intervalo = setInterval(() => {
      tiempo++;
      tiempoTxt.textContent = tiempo;
    }, 1000);
  }
}

// 🔹 Detener tiempo
function detenerTiempo() {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }
}

// 🔹 Validar caracter ingresado
function validarCaracter(caracter) {
  // Permitir letras (minúsculas y mayúsculas)
  if (/^[a-zA-Z]$/.test(caracter)) {
    return true;
  }
  
  // Permitir símbolos comunes
  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]$/.test(caracter)) {
    return true;
  }
  
  // Permitir números del 0 al 100
  const numero = parseInt(caracter);
  if (!isNaN(numero) && numero >= 0 && numero <= 100) {
    return true;
  }
  
  // Permitir caracteres especiales adicionales
  if (/^[áéíóúñüÁÉÍÓÚÑÜ]$/.test(caracter)) {
    return true;
  }
  
  return false;
}

// 🔹 Seleccionar primer jugador
jugadores.forEach((jugador, index) => {
  jugador.addEventListener("click", () => {
    if (!juegoIniciado) {
      // Remover selección anterior
      jugadores.forEach(j => j.classList.remove("jugador-activo"));
      
      // Seleccionar primer jugador
      jugadorActivo = nombres[index];
      indiceJugadorActivo = index;
      jugador.classList.add("jugador-activo");
      turnoTxt.textContent = `Turno de: ${jugadorActivo}`;
      
      // Enfocar primera casilla
      letras[0].focus();
    }
  });
});

// 🔹 Verificar si el jugador actual completó todas las casillas
function verificarJugadorCompleto() {
  const casillasDelJugador = Array.from(letras).filter(letra => 
    letra.dataset.jugador === jugadorActivo
  );
  return casillasDelJugador.length === letras.length;
}

// 🔹 Pasar al siguiente jugador
function siguienteJugador() {
  // Detener el reloj y guardar tiempo del jugador actual
  if (jugadorActivo) {
    detenerTiempo();
    registrosJugadores.push({
      nombre: jugadorActivo,
      tiempo: tiempo,
      completado: true
    });
    actualizarRegistro();
  }
  
  // Limpiar todas las casillas para el siguiente jugador
  letras.forEach(letra => {
    letra.textContent = "_";
    letra.classList.remove("letra-llena");
    delete letra.dataset.jugador;
    delete letra.dataset.tiempo;
  });
  
  // Pasar al siguiente jugador
  indiceJugadorActivo = (indiceJugadorActivo + 1) % nombres.length;
  jugadorActivo = nombres[indiceJugadorActivo];
  
  // Actualizar interfaz
  jugadores.forEach(j => j.classList.remove("jugador-activo"));
  jugadores[indiceJugadorActivo].classList.add("jugador-activo");
  turnoTxt.textContent = `Turno de: ${jugadorActivo}`;
  
  // Reiniciar el reloj para el nuevo jugador
  tiempo = 0;
  tiempoTxt.textContent = "0";
  
  // Enfocar primera casilla (ahora todas están vacías)
  casillaActual = 0;
  letras[casillaActual].focus();
  
  // Verificar si todos han jugado
  if (registrosJugadores.length >= nombres.length) {
    todosJugaron = true;
    finalizarJuego.classList.add("mostrar");
    turnoTxt.textContent = "¡Todos han jugado! Presiona Finalizar";
  }
}

// 🔹 Actualizar registro de jugadores
function actualizarRegistro() {
  listaRegistros.innerHTML = "";
  registrosJugadores.forEach(registro => {
    const div = document.createElement("div");
    div.className = "registro-item completado";
    div.innerHTML = `
      <strong>${registro.nombre}</strong><br>
      Tiempo: ${registro.tiempo}s
    `;
    listaRegistros.appendChild(div);
  });
}

// 🔹 Navegación con teclado
document.addEventListener("keydown", (e) => {
  if (!juegoIniciado || !jugadorActivo) return;
  
  switch(e.key) {
    case "ArrowLeft":
      e.preventDefault();
      // Buscar casilla vacía hacia la izquierda
      for (let i = casillaActual - 1; i >= 0; i--) {
        if (letras[i].textContent === "_") {
          casillaActual = i;
          letras[casillaActual].focus();
          break;
        }
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      // Buscar casilla vacía hacia la derecha
      for (let i = casillaActual + 1; i < letras.length; i++) {
        if (letras[i].textContent === "_") {
          casillaActual = i;
          letras[casillaActual].focus();
          break;
        }
      }
      break;
    case "Enter":
      e.preventDefault();
      if (letras[casillaActual].textContent === "_") {
        letras[casillaActual].click();
      }
      break;
  }
});


// 🔹 Agregar letra en los espacios
letras.forEach((letra, index) => {
  letra.addEventListener("click", () => {
    if (!jugadorActivo) {
      alert("Selecciona un jugador primero");
      return;
    }
    
    if (letra.textContent !== "_") {
      alert("Esta casilla ya está ocupada");
      return;
    }
    
    // Iniciar el juego y el reloj cuando el jugador comience a poner letras
    if (!juegoIniciado) {
      juegoIniciado = true;
    }
    
    // Iniciar el reloj (se reinicia para cada jugador)
    iniciarTiempo();
    
    const caracter = prompt(`Turno de ${jugadorActivo}: escribe una letra (minúscula/mayúscula), símbolo o número (0-100)`);
    if (caracter && caracter.length > 0) {
      // Validar que sea un caracter válido
      const esValido = validarCaracter(caracter);
      if (esValido) {
        letra.textContent = caracter;
        letra.dataset.jugador = jugadorActivo;
        letra.dataset.tiempo = tiempo;
        letra.classList.add("letra-llena");
        
        // Verificar si el jugador actual completó todas las casillas
        if (verificarJugadorCompleto()) {
          // El jugador completó todas las casillas, pasar al siguiente
          setTimeout(() => {
            siguienteJugador();
            // Verificar si todos han jugado después de cambiar de jugador
            setTimeout(() => {
              console.log(`Registros: ${registrosJugadores.length}, Nombres: ${nombres.length}`);
              if (registrosJugadores.length >= nombres.length) {
                todosJugaron = true;
                finalizarJuego.classList.add("mostrar");
                turnoTxt.textContent = "¡Todos han jugado! Presiona Finalizar";
                console.log("Mostrando botón finalizar");
              }
            }, 100);
          }, 1000);
        } else {
          // El jugador aún no ha completado, pasar a la siguiente casilla automáticamente
          setTimeout(() => {
            const siguienteCasilla = Array.from(letras).findIndex(l => l.textContent === "_");
            if (siguienteCasilla !== -1) {
              casillaActual = siguienteCasilla;
              letras[casillaActual].focus();
            }
          }, 500);
        }
      } else {
        alert("Caracter no válido. Solo se permiten:\n- Letras (a-z, A-Z)\n- Símbolos (!@#$%^&*()_+-=[]{}|;':\",./<>?~`)\n- Números (0-100)\n- Caracteres especiales (áéíóúñü)");
      }
    }
  });
  
  // Enfocar casilla al hacer clic
  letra.addEventListener("focus", () => {
    casillaActual = index;
  });
});

// 🔹 Finalizar juego y guardar en base de datos
finalizarJuego.addEventListener("click", async () => {
  try {
    // Preparar datos para guardar
    const datosJuego = {
      fecha: new Date().toISOString(),
      jugadores: registrosJugadores,
      tiempoTotal: tiempo
    };
    
    // Simular guardado en base de datos (localStorage por ahora)
    const juegosAnteriores = JSON.parse(localStorage.getItem('juegos') || '[]');
    juegosAnteriores.push(datosJuego);
    localStorage.setItem('juegos', JSON.stringify(juegosAnteriores));
    
    // Mostrar mensaje de éxito
    alert(`¡Juego finalizado y guardado!\n\nResultados:\n${registrosJugadores.map(r => `${r.nombre}: ${r.tiempo}s`).join('\n')}`);
    
    // Redirigir al index
    window.location.href = "index.html";
    
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar el juego. Intenta de nuevo.');
  }
});

// 🔹 Nueva mesa (reiniciar juego)
nuevaMesa.addEventListener("click", () => {
  // Detener el reloj
  detenerTiempo();
  
  // Reiniciar variables
  jugadorActivo = null;
  indiceJugadorActivo = 0;
  tiempo = 0;
  juegoIniciado = false;
  casillaActual = 0;
  registrosJugadores = [];
  todosJugaron = false;
  
  // Limpiar la interfaz
  jugadores.forEach(j => j.classList.remove("jugador-activo"));
  letras.forEach(letra => {
    letra.textContent = "_";
    letra.classList.remove("letra-llena");
    delete letra.dataset.jugador;
    delete letra.dataset.tiempo;
  });
  
  // Limpiar registro
  listaRegistros.innerHTML = "";
  
  // Ocultar botón finalizar
  finalizarJuego.classList.remove("mostrar");
  
  // Actualizar textos y estilos
  turnoTxt.textContent = "Selecciona al jugador";
  turnoTxt.style.color = "#00bfff";
  turnoTxt.style.textShadow = "0 0 10px rgba(0, 191, 255, 0.8)";
  tiempoTxt.textContent = "0";

  // Redirigir al index.html
  window.location.href = "index.html";
});
