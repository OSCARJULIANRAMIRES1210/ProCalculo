<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Juego</title>
  <link rel="stylesheet" href="estilo.css">
</head>
<body>
    <h1 class="titulo">Ciencias 4D</h1>
    <div class="container">
        <div class="players-section">
            <h2>Jugadores</h2>
            <div class="players">
                <div class="player">
                    <label>Jugador 1:</label>
                    <input type="text" id="jugador1" placeholder="Nombre">
                </div>
                <div class="player">
                    <label>Jugador 2:</label>
                    <input type="text" id="jugador2" placeholder="Nombre">
                </div>
                <div class="player">
                    <label>Jugador 3:</label>
                    <input type="text" id="jugador3" placeholder="Nombre">
                </div>
                    <div class="player">
                    <label>Jugador 4:</label>
                <input type="text" id="jugador4" placeholder="Nombre">
                </div>
            </div>
            <button id="btnIniciar">Iniciar</button>
        </div>
    </div>
    <script>
        const equations = ["∫x²dx", "E=mc²", "ΣF=ma", "∂/∂x", "π≈3.1416", "Δv/Δt", "∇·E=ρ/ε₀"];
        for(let i=0; i<15; i++){
        const el = document.createElement('div');
        el.className = 'equation';
        el.textContent = equations[Math.floor(Math.random()*equations.length)];
        el.style.left = Math.random()*100 + 'vw';
        el.style.animationDuration = (8 + Math.random()*8) + 's';
        el.style.fontSize = (16 + Math.random()*20) + 'px';
        document.body.appendChild(el);
        }
    </script>
</body>
</html>