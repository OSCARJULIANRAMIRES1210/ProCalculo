// datos.js

const form = document.getElementById("formPregunta");
const tablaPreguntas = document.getElementById("tablaPreguntas");
const tablaMovimientos = document.getElementById("tablaMovimientos");

// ----------------------
// CRUD PREGUNTAS
// ----------------------
async function cargarPreguntas() {
  const preguntas = await DB.getPreguntas();
  tablaPreguntas.innerHTML = "";

  preguntas.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.pregunta}</td>
      <td>${p.respuesta}</td>
      <td>
        <button onclick="editarPregunta(${p.id})">Editar</button>
        <button onclick="eliminarPregunta(${p.id})">Eliminar</button>
        <button onclick="seleccionarPregunta(${p.id})">Usar</button>
      </td>
    `;
    tablaPreguntas.appendChild(tr);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("idPregunta").value;
  const pregunta = document.getElementById("pregunta").value.trim();
  const respuesta = document.getElementById("respuesta").value.trim();

  if (!pregunta || !respuesta) {
    alert("Completa ambos campos");
    return;
  }

  if (id) {
    await DB.updatePregunta({ id: Number(id), pregunta, respuesta });
  } else {
    await DB.addPregunta({ pregunta, respuesta });
  }

  form.reset();
  cargarPreguntas();
});

// Editar pregunta
async function editarPregunta(id) {
  const p = await DB.getPreguntaById(id);
  document.getElementById("idPregunta").value = p.id;
  document.getElementById("pregunta").value = p.pregunta;
  document.getElementById("respuesta").value = p.respuesta;
}

// Eliminar pregunta
async function eliminarPregunta(id) {
  if (confirm("¿Seguro que quieres eliminar esta pregunta?")) {
    await DB.deletePregunta(id);
    cargarPreguntas();
  }
}

// Seleccionar pregunta para el juego
function seleccionarPregunta(id) {
  localStorage.setItem("preguntaActivaId", id);
  alert("Pregunta seleccionada para la próxima mesa");
}

// ----------------------
// MOSTRAR MOVIMIENTOS
// ----------------------
async function cargarMovimientos() {
  const mesas = await DB.getMesas();
  tablaMovimientos.innerHTML = "";

  for (const mesa of mesas) {
    const movimientos = await DB.getMovimientosByMesa(mesa.id);
    movimientos.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${mesa.id}</td>
        <td>${m.jugador}</td>
        <td>${m.letra}</td>
        <td>${m.posicion + 1}</td>
        <td>${m.tiempo}s</td>
        <td>${m.correcta ? "✅" : "❌"}</td>
      `;
      tablaMovimientos.appendChild(tr);
    });
  }
}

// Inicializar todo al cargar

function mostrarJuegos() {
  const tablaJuegos = document.getElementById("tablaJuegos");
  tablaJuegos.innerHTML = "";
  const juegos = JSON.parse(localStorage.getItem("juegos") || "[]");
  if (juegos.length === 0) {
    tablaJuegos.innerHTML = "<p>No hay registros de juegos.</p>";
    return;
  }
  const table = document.createElement("table");
  table.style.margin = "20px auto";
  table.style.width = "95%";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Grupo</th>
        <th>Jugadores</th>
        <th>Jugador</th>
        <th>Tiempo (s)</th>
        <th>Palabra</th>
        <th>Posición</th>
        <th>Letra</th>
        <th>Correcta</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  const jugadoresRegistrados = localStorage.getItem("jugadores") || "-";
  juegos.forEach(j => {
    if (j.posiciones && Array.isArray(j.posiciones)) {
      j.posiciones.forEach(pos => {
        tbody.innerHTML += `
          <tr>
            <td>${j.grupo || "-"}</td>
            <td>${jugadoresRegistrados}</td>
            <td>${j.jugador}</td>
            <td>${j.tiempo}</td>
            <td>${j.palabra}</td>
            <td>${pos.posicion}</td>
            <td style="font-weight:bold; color:${pos.correcta ? '#3cff7a' : '#ff3c3c'}">${pos.letra || '_'}</td>
            <td>${pos.correcta ? '✅' : '❌'}</td>
          </tr>
        `;
      });
    } else {
      // Fallback para registros viejos
      tbody.innerHTML += `
        <tr>
          <td>${j.grupo || "-"}</td>
          <td>${jugadoresRegistrados}</td>
          <td>${j.jugador}</td>
          <td>${j.tiempo}</td>
          <td>${j.palabra}</td>
          <td>-</td>
          <td>${j.ingresadas || '-'}</td>
          <td>-</td>
        </tr>
      `;
    }
  });
  tablaJuegos.appendChild(table);
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarJuegos();
  // ...botón datos y otros...
  const btnDatos = document.getElementById("btnDatos");
  if (btnDatos) {
    btnDatos.addEventListener("click", () => {
      window.location.href = "datos.html";
    });
  }
});


