// juego.js

// ----------------------
// Referencias DOM
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
const preguntaEl = document.createElement("h2");
document.body.insertBefore(preguntaEl, document.body.children[1]);

// ----------------------
// Variables de juego
// ----------------------
let tiempo = 0;
let intervalo = null;
let jugadorActivo = null;
let respuestaCorrecta = "";
let letrasCompletadas = 0;

// ----------------------
// Obtener mesaId y cargar datos
// ----------------------
const params = new URLSearchParams(window.location.search);
const mesaId = Number(params.get("mesaId"));

(async function init() {
  const mesa = await DB.getMesaById(mesaId);
  if (!mesa) {
    alert("No se encontró la mesa");
    return;
  }

  // Mostrar nombres en los botones
  mesa.jugadores.forEach((nombre, i) => {
    if (nombre) botones[i].textContent = nombre;
  });

  // Cargar pregunta activa
  if (!mesa.preguntaId) {
    alert("La mesa no tiene pregunta asignada");
    return;
  }

  const pregunta = await DB.getPreguntaById(mesa.preguntaId);
  if (!pregunta) {
    alert("No se encontró la pregunta");
    return;
  }

  preguntaEl.textContent = pregunta.pregunta;
  respuestaCorrecta = pregunta.respuesta.toUpperCase();

  // Ajustar número de letras según respuesta
  letras.forEach((el, index) => {
    if (index < respuestaCorrecta.length) {
      el.textContent = "_";
    } else {
      el.style.display = "none";
    }
  });
})();

// ----------------------
// Funciones de juego
// ----------------------
function iniciarTiempo() {
  if (!intervalo) {
    intervalo = setInterval(() => {
      tiempo++;
      tiempoTxt.textContent = tiempo;
    }, 1000);
  }
}

// Seleccionar jugador
botones.forEach(btn => {
  btn.addEventListener("click", () => {
    jugadorActivo = btn.textContent;
    turnoTxt.textContent = `Turno de: ${jugadorActivo}`;
    iniciarTiempo();
  });
});

// Manejo de letras
letras.forEach((letraEl, index) => {
  letraEl.addEventListener("click", async () => {
    if (!jugadorActivo) {
      alert("Selecciona un jugador primero");
      return;
    }
    if (letraEl.textContent !== "_") {
      alert("Esta posición ya fue completada");
      return;
    }

    const caracter = prompt(`Turno de ${jugadorActivo}: escribe una letra`);
    if (!caracter || caracter.length !== 1) return;

    const letra = caracter.toUpperCase();
    const correcta = respuestaCorrecta[index] === letra;

    if (correcta) {
      letraEl.textContent = letra;
      letraEl.classList.add("ok");
      letrasCompletadas++;
    } else {
      letraEl.classList.add("error");
      alert("Letra incorrecta");
    }

    // Registrar movimiento en IndexedDB
    await DB.addMovimiento({
      mesaId,
      jugador: jugadorActivo,
      letra,
      posicion: index,
      tiempo,
      correcta
    });

    // Terminar juego solo si completó toda la palabra correcta
    if (letrasCompletadas === respuestaCorrecta.length) {
      clearInterval(intervalo);
      const mesa = await DB.getMesaById(mesaId);
      mesa.tiempoTotal = tiempo;
      await DB.updateMesa(mesa);

      alert(`🎉 ¡Juego terminado en ${tiempo} segundos!`);
    }
  });
});

// ----------------------
// Nueva mesa
// ----------------------
nuevaMesa.addEventListener("click", () => {
  clearInterval(intervalo);
  window.location.href = "index.html";
});
// const params = new URLSearchParams(window.location.search); // Eliminado para evitar redeclaración
const nombres = [
  params.get("j1") || "Jugador 1",
  params.get("j2") || "Jugador 2",
  params.get("j3") || "Jugador 3",
  params.get("j4") || "Jugador 4"
];


function crearEcuacionesMatematicas() {
  const ecuaciones = [
    "x² + y² = r²",
    "a² + b² = c²",
    "π = 3.14159...",
    "e = 2.71828...",
    "√2 = 1.41421...",
    "φ = (1+√5)/2",
    "sin²θ + cos²θ = 1",
    "∫f(x)dx",
    "lim x→∞",
    "∑n=1∞",
    "∂f/∂x",
    "∇f",
    "α + β = γ",
    "log₁₀(x)",
    "2ⁿ",
    "n!",
    "C(n,k)",
    "P(A|B)",
    "E[X] = μ",
    "σ² = Var(X)"
  ];

  ecuaciones.forEach((ecuacion, index) => {
    setTimeout(() => {
      const elemento = document.createElement('div');
      elemento.className = 'equation';
      elemento.textContent = ecuacion;
      elemento.style.left = Math.random() * 100 + '%';
      elemento.style.animationDelay = Math.random() * 5 + 's';
      elemento.style.fontSize = (Math.random() * 10 + 16) + 'px';
      document.body.appendChild(elemento);

      setTimeout(() => {
        if (elemento.parentNode) {
          elemento.parentNode.removeChild(elemento);
        }
      }, 20000);
    }, index * 2000);
  });
}

crearEcuacionesMatematicas();
setInterval(crearEcuacionesMatematicas, 25000);


const jugadores = [
  document.getElementById("j1"),
  document.getElementById("j2"),
  document.getElementById("j3"),
  document.getElementById("j4")
];
const finalizarJuego = document.getElementById("finalizarJuego");
const listaRegistros = document.getElementById("lista-registros");

// let jugadorActivo = null; // Eliminado porque ya está declarado arriba
let indiceJugadorActivo = 0;
let juegoIniciado = false;
let casillaActual = 0;
let registrosJugadores = [];
let todosJugaron = false;


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


function validarCaracter(caracter) {
  
  if (/^[a-zA-Z]$/.test(caracter)) {
    return true;
  }
  
  
  if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]$/.test(caracter)) {
    return true;
  }
  

  const numero = parseInt(caracter);
  if (!isNaN(numero) && numero >= 0 && numero <= 100) {
    return true;
  }
  

  if (/^[áéíóúñüÁÉÍÓÚÑÜ]$/.test(caracter)) {
    return true;
  }
  
  return false;
}

jugadores.forEach((jugador, index) => {
  jugador.addEventListener("click", () => {
    if (!juegoIniciado) {
      
      jugadores.forEach(j => j.classList.remove("jugador-activo"));
      
      jugadorActivo = nombres[index];
      indiceJugadorActivo = index;
      jugador.classList.add("jugador-activo");
      turnoTxt.textContent = `Turno de: ${jugadorActivo}`;
    
      letras[0].focus();
    }
  });
});


function verificarJugadorCompleto() {
  const casillasDelJugador = Array.from(letras).filter(letra => 
    letra.dataset.jugador === jugadorActivo
  );
  return casillasDelJugador.length === letras.length;
}


function siguienteJugador() {
  
  if (jugadorActivo) {
    detenerTiempo();
    registrosJugadores.push({
      nombre: jugadorActivo,
      tiempo: tiempo,
      completado: true
    });
    actualizarRegistro();
  }
  
  
  letras.forEach(letra => {
    letra.textContent = "_";
    letra.classList.remove("letra-llena");
    delete letra.dataset.jugador;
    delete letra.dataset.tiempo;
  });
  
  
  indiceJugadorActivo = (indiceJugadorActivo + 1) % nombres.length;
  jugadorActivo = nombres[indiceJugadorActivo];
  

  jugadores.forEach(j => j.classList.remove("jugador-activo"));
  jugadores[indiceJugadorActivo].classList.add("jugador-activo");
  turnoTxt.textContent = `Turno de: ${jugadorActivo}`;
  
  
  tiempo = 0;
  tiempoTxt.textContent = "0";
  
  casillaActual = 0;
  letras[casillaActual].focus();
  
  if (registrosJugadores.length >= nombres.length) {
    todosJugaron = true;
    finalizarJuego.classList.add("mostrar");
    turnoTxt.textContent = "¡Todos han jugado! Presiona Finalizar";
  }
}


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

document.addEventListener("keydown", (e) => {
  if (!juegoIniciado || !jugadorActivo) return;
  
  switch(e.key) {
    case "ArrowLeft":
      e.preventDefault();
      
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
    
    
    if (!juegoIniciado) {
      juegoIniciado = true;
    }
    
   
    iniciarTiempo();
    
    const caracter = prompt(`Turno de ${jugadorActivo}: escribe una letra (minúscula/mayúscula), símbolo o número (0-100)`);
    if (caracter && caracter.length > 0) {
      
      const esValido = validarCaracter(caracter);
      if (esValido) {
        letra.textContent = caracter;
        letra.dataset.jugador = jugadorActivo;
        letra.dataset.tiempo = tiempo;
        letra.classList.add("letra-llena");
        
       
        if (verificarJugadorCompleto()) {
          
          setTimeout(() => {
            siguienteJugador();
           
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
  
  letra.addEventListener("focus", () => {
    casillaActual = index;
  });
});


finalizarJuego.addEventListener("click", async () => {
  try {
   
    const datosJuego = {
      fecha: new Date().toISOString(),
      jugadores: registrosJugadores,
      tiempoTotal: tiempo
    };
    
    
    const juegosAnteriores = JSON.parse(localStorage.getItem('juegos') || '[]');
    juegosAnteriores.push(datosJuego);
    localStorage.setItem('juegos', JSON.stringify(juegosAnteriores));
    
    
    alert(`¡Juego finalizado y guardado!\n\nResultados:\n${registrosJugadores.map(r => `${r.nombre}: ${r.tiempo}s`).join('\n')}`);
    
   
    window.location.href = "index.html";
    
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar el juego. Intenta de nuevo.');
  }
});


nuevaMesa.addEventListener("click", () => {
 
  detenerTiempo();
  
  
  jugadorActivo = null;
  indiceJugadorActivo = 0;
  tiempo = 0;
  juegoIniciado = false;
  casillaActual = 0;
  registrosJugadores = [];
  todosJugaron = false;
  

  jugadores.forEach(j => j.classList.remove("jugador-activo"));
  letras.forEach(letra => {
    letra.textContent = "_";
    letra.classList.remove("letra-llena");
    delete letra.dataset.jugador;
    delete letra.dataset.tiempo;
  });
  
  
  listaRegistros.innerHTML = "";
  
 
  finalizarJuego.classList.remove("mostrar");
  
  
  turnoTxt.textContent = "Selecciona al jugador";
  turnoTxt.style.color = "#00bfff";
  turnoTxt.style.textShadow = "0 0 10px rgba(0, 191, 255, 0.8)";
  tiempoTxt.textContent = "0";

  window.location.href = "index.html";
});
