import { LocalStorageRepository }
from "./repositories/LocalStorageRepository.js";

import { HomeView }
from "./views/HomeView.js";

import { PDFService }
from "./services/PDFService.js";

import { renderAuth }
from "./auth/AuthGuard.js";

import { AuthService }
from "./auth/AuthService.js";



const repository =
  new LocalStorageRepository();

const app =
  document.getElementById("app");

AuthService.seedAdmin()

renderAuth();

const currentUser =
  AuthService.currentUser();

if (currentUser) {

  const userName =
    document.getElementById(
      "user-name"
    );

  const userRole =
    document.getElementById(
      "user-role"
    );

  if (userName) {

    userName.textContent =
      currentUser.name;
  }

  if (userRole) {

    userRole.textContent =

      currentUser.role === "admin"
        ? "Administrador"
        : "Árbitro";
  }
}

document
  .getElementById("logout-btn")
  ?.addEventListener("click", () => {

    AuthService.logout();
  });

if (
  !AuthService.isAuthenticated()
) {

  document
    .getElementById("app")
    .style.display = "none";

} else {

  document
    .getElementById("auth-screen")
    .style.display = "none";
}

function render() {

  const matches =
    repository.getAll();

  app.innerHTML =
    HomeView(matches);

  bindEvents();
}

function bindEvents() {

  // NUEVO PARTIDO
  document
    .getElementById("new-match")
    ?.addEventListener("click", () => {

      openMatchForm();
    });


  // ELIMINAR
  document
    .querySelectorAll("[data-delete]")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        const confirmed =
          confirm("¿Eliminar partido?");

        if (!confirmed) return;

        repository.delete(
          btn.dataset.delete
        );

        render();
      });
    });


  // EDITAR
  document
    .querySelectorAll("[data-edit]")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        const matchId =
          btn.dataset.edit;

        const matches =
          repository.getAll();

        const match =
          matches.find(
            m => m.id === matchId
          );

        openMatchForm(match);
      });
    });

    document
  .querySelectorAll("[data-open]")
  .forEach(card => {

    card.addEventListener("click", (e) => {

      // Evitar abrir si pulsó editar/eliminar
      if (
        e.target.closest("button")
      ) return;

      const matchId =
        card.dataset.open;

      openMatchView(matchId);
    });
});

function openMatchView(matchId) {

  const matches =
    repository.getAll();

  const match =
    matches.find(
      m => m.id === matchId
    );

  if (!match) return;

  app.innerHTML = `

    <section class="card">

      <h2>
        ${match.localTeam.name}
        vs
        ${match.awayTeam.name}
      </h2>

      <p>
        ${new Date(match.date)
          .toLocaleString()}
      </p>

      <hr />

      <div class="grid grid-2">

        <!-- EQUIPO LOCAL -->
        <section>

          <h3>
            ${match.localTeam.name}
          </h3>

          <div id="local-players"></div>

          <button
            class="btn btn-primary"
            id="add-local-player"
          >
            Añadir jugador
          </button>

        </section>

        <!-- EQUIPO VISITANTE -->
        <section>

          <h3>
            ${match.awayTeam.name}
          </h3>

          <div id="away-players"></div>

          <button
            class="btn btn-primary"
            id="add-away-player"
          >
            Añadir jugador
          </button>

        </section>

      </div>

      <hr />

      <h3>Eventos</h3>

      <div class="flex gap-md">

        <button
          class="btn btn-success"
          id="goal-btn"
        >
          ⚽ Gol
        </button>

        <button
          class="btn btn-warning"
          id="yellow-btn"
        >
          🟨 Amarilla
        </button>

        <button
          class="btn btn-danger"
          id="red-btn"
        >
          🟥 Roja
        </button>

        <button
          class="btn btn-primary"
          id="sub-btn"
        >
          🔄 Sustitución
        </button>

      </div>

      <div
        id="timeline"
        class="timeline mt-md"
      ></div>

      <hr />

      <div class="flex gap-md">

        <button
          class="btn btn-success"
          id="finish-match"
        >
          Finalizar partido
        </button>

        <button
          class="btn btn-primary"
          id="download-pdf"
        >
          Descargar PDF
        </button>

        <button
          class="btn btn-secondary"
          id="back-home"
        >
          Volver
        </button>

      </div>

    </section>
  `;

  bindMatchEvents(match);
}

function openPlayerModal(match, team) {

  const modal = document.createElement("div");

  modal.className = "modal-overlay";

  modal.innerHTML = `

    <div class="modal">

      <h2>Añadir jugador</h2>

      <form id="player-form">

        <div class="form-group">

          <label class="form-label">
            Nombre
          </label>

          <input
            class="form-input"
            id="player-name"
            required
          />

        </div>

        <div class="form-group">

          <label class="form-label">
            Dorsal
          </label>

          <input
            type="number"
            class="form-input"
            id="player-number"
            required
          />

        </div>

        <div class="form-group">

          <label>

            <input
              type="checkbox"
              id="player-starter"
            />

            Titular

          </label>

        </div>

        <div class="flex gap-md">

          <button
            type="submit"
            class="btn btn-primary"
          >
            Guardar
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            id="close-modal"
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  `;

  document.body.appendChild(modal);


  // CERRAR
  document
    .getElementById("close-modal")
    .addEventListener("click", () => {

      modal.remove();
    });


  // GUARDAR
  document
    .getElementById("player-form")
    .addEventListener("submit", (e) => {

      e.preventDefault();

      const name =
        document
          .getElementById("player-name")
          .value;

      const number =
        parseInt(
          document
            .getElementById("player-number")
            .value
        );

      const starter =
        document
          .getElementById("player-starter")
          .checked;


      if (!team.players) {
        team.players = [];
      }

      const repeated =
        team.players.some(
          p => p.number === number
        );

      if (repeated) {

        alert("Dorsal repetido");

        return;
      }

      team.players.push({

        id: crypto.randomUUID(),

        name,

        number,

        starter,

        onField: starter
      });

      repository.save(match);

      modal.remove();

      openMatchView(match.id);
    });
}


function bindMatchEvents(match) {

  renderPlayers(match);

  renderTimeline(match);


  // VOLVER
  document
    .getElementById("back-home")
    .addEventListener("click", render);


  // AÑADIR JUGADOR LOCAL
  document
    .getElementById("add-local-player")
    .addEventListener("click", () => {

      openPlayerModal(
        match,
        match.localTeam
      );
    });


  // AÑADIR JUGADOR VISITANTE
  document
    .getElementById("add-away-player")
    .addEventListener("click", () => {

      openPlayerModal(
        match,
        match.awayTeam
      );
    });


  // GOL
  document
    .getElementById("goal-btn")
    .addEventListener("click", () => {

      addEvent(match, "goal");
    });


  // AMARILLA
  document
    .getElementById("yellow-btn")
    .addEventListener("click", () => {

      addEvent(match, "yellow");
    });


  // ROJA
  document
    .getElementById("red-btn")
    .addEventListener("click", () => {

      addEvent(match, "red");
    });


  // SUSTITUCIÓN
  document
    .getElementById("sub-btn")
    .addEventListener("click", () => {

      addEvent(match, "substitution");
    });


  // ✅ DESCARGAR PDF
  document
    .getElementById("download-pdf")
    .addEventListener("click", () => {

      PDFService.generate(match);
    });


  // FINALIZAR PARTIDO
  document
    .getElementById("finish-match")
    .addEventListener("click", () => {

      match.status = "Finalizado";

      repository.save(match);

      openMatchView(match.id);
    });

// EDITAR EVENTO
document
  .querySelectorAll(".edit-event-btn")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      editEvent(
        match,
        btn.dataset.eventId
      );
    });
});


// ELIMINAR EVENTO
document
  .querySelectorAll(".delete-event-btn")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      deleteEvent(
        match,
        btn.dataset.eventId
      );
    });
});

// EDITAR JUGADOR
document
  .querySelectorAll(".edit-player-btn")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      editPlayer(
        match,
        btn.dataset.teamId,
        btn.dataset.playerId
      );
    });
});


// ELIMINAR JUGADOR
document
  .querySelectorAll(".delete-player-btn")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      deletePlayer(
        match,
        btn.dataset.teamId,
        btn.dataset.playerId
      );
    });
});

}


function addPlayer(match, team) {

  const name =
    prompt("Nombre del jugador");

  if (!name) return;

  const number =
    parseInt(
      prompt("Dorsal")
    );

  if (isNaN(number)) {
    alert("Dorsal inválido");
    return;
  }

  if (!team.players) {
    team.players = [];
  }

  const repeated =
    team.players.some(
      p => p.number === number
    );

  if (repeated) {
    alert("Dorsal repetido");
    return;
  }

  team.players.push({

    id: crypto.randomUUID(),

    name,

    number,

    starter: false,

    onField: false
  });

  repository.save(match);

  openMatchView(match.id);
}
function addEvent(match, type) {

  const modal = document.createElement("div");

  modal.className = "modal-overlay";


  // TODOS LOS JUGADORES
  const allPlayers = [

    ...match.localTeam.players.map(p => ({
      ...p,
      team: match.localTeam
    })),

    ...match.awayTeam.players.map(p => ({
      ...p,
      team: match.awayTeam
    }))
  ];


  modal.innerHTML = `

    <div class="modal">

      <h2>

        ${
          type === "goal"
            ? "⚽ Registrar gol"
            : ""

        }

        ${
          type === "yellow"
            ? "🟨 Tarjeta amarilla"
            : ""

        }

        ${
          type === "red"
            ? "🟥 Tarjeta roja"
            : ""

        }

        ${
          type === "substitution"
            ? "🔄 Sustitución"
            : ""

        }

      </h2>


      <form id="event-form">

        <!-- MINUTO -->

        <div class="form-group">

          <label class="form-label">
            Minuto
          </label>

          <input
            type="number"
            min="0"
            class="form-input"
            id="event-minute"
            required
          />

        </div>


        <!-- JUGADOR -->

        <div class="form-group">

          <label class="form-label">
            Jugador
          </label>

          <select
            class="form-select"
            id="event-player"
            required
          >

            <option value="">
              Seleccionar jugador
            </option>

            ${allPlayers.map(player => `

              <option value="${player.id}">

                ${player.team.name}
                -
                #${player.number}
                ${player.name}

              </option>

            `).join("")}

          </select>

        </div>


        <!-- DOBLE AMARILLA -->

        ${
          type === "red"
          ? `
            <div class="form-group">

              <label class="form-label">
                Tipo de roja
              </label>

              <select
                class="form-select"
                id="red-type"
              >

                <option value="direct">
                  Roja directa
                </option>

                <option value="double-yellow">
                  Doble amarilla
                </option>

              </select>

            </div>
          `
          : ""
        }


        <div id="yellow-warning"></div>


        <!-- BOTONES -->

        <div class="flex gap-md">

          <button
            type="submit"
            class="btn btn-primary"
          >
            Guardar
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            id="close-event-modal"
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  `;


  document.body.appendChild(modal);


  // CERRAR
  document
    .getElementById("close-event-modal")
    .addEventListener("click", () => {

      modal.remove();
    });


  // DETECTAR AMARILLAS
  const playerSelect =
    document.getElementById("event-player");

  playerSelect.addEventListener("change", () => {

    const playerId =
      playerSelect.value;

    const warning =
      document.getElementById(
        "yellow-warning"
      );

    const player =
      allPlayers.find(
        p => p.id === playerId
      );

    if (!player) return;

    const yellowCards =
      match.events.filter(e =>

        e.type === "yellow"
        &&
        e.playerId === player.id
      );

    if (yellowCards.length >= 1) {

      warning.innerHTML = `

        <div class="badge badge-warning">

          ⚠ Este jugador tiene
          ${yellowCards.length}
          amarilla(s)

        </div>
      `;

    } else {

      warning.innerHTML = "";
    }
  });


  // GUARDAR EVENTO
  document
    .getElementById("event-form")
    .addEventListener("submit", (e) => {

      e.preventDefault();


      const minute =
        parseInt(
          document
            .getElementById("event-minute")
            .value
        );

      if (isNaN(minute)) {

        alert("Minuto inválido");

        return;
      }


      const playerId =
        document
          .getElementById("event-player")
          .value;

      const player =
        allPlayers.find(
          p => p.id === playerId
        );

      if (!player) return;


      const event = {

        id: crypto.randomUUID(),

        type,

        minute,

        teamId: player.team.id,

        playerId: player.id,

        playerName: player.name
      };


      // ROJA
      if (type === "red") {

        const redType =
          document
            .getElementById("red-type")
            .value;

        event.redType = redType;


        // DOBLE AMARILLA
        if (
          redType === "double-yellow"
        ) {

          const yellowCards =
            match.events.filter(e =>

              e.type === "yellow"
              &&
              e.playerId === player.id
            );

          if (yellowCards.length < 2) {

            alert(
              "El jugador no tiene dos amarillas."
            );

            return;
          }

          event.relatedYellowIds =
            yellowCards.map(
              y => y.id
            );
        }


        // EXPULSAR
        player.onField = false;
      }

      // SUSTITUCIÓN
if (type === "substitution") {

  modal.innerHTML = `

    <div class="modal">

      <h2>
        🔄 Sustitución
      </h2>

      <form id="sub-form">

        <!-- EQUIPO -->

        <div class="form-group">

          <label class="form-label">
            Equipo
          </label>

          <select
            class="form-select"
            id="sub-team"
            required
          >

            <option value="">
              Seleccionar equipo
            </option>

            <option value="${match.localTeam.id}">
              ${match.localTeam.name}
            </option>

            <option value="${match.awayTeam.id}">
              ${match.awayTeam.name}
            </option>

          </select>

        </div>


        <!-- MINUTO -->

        <div class="form-group">

          <label class="form-label">
            Minuto
          </label>

          <input
            type="number"
            min="0"
            class="form-input"
            id="sub-minute"
            required
          />

        </div>


        <!-- SALE -->

        <div class="form-group">

          <label class="form-label">
            Jugador que sale
          </label>

          <select
            class="form-select"
            id="player-out"
            required
          >

            <option value="">
              Seleccionar
            </option>

          </select>

        </div>


        <!-- ENTRA -->

        <div class="form-group">

          <label class="form-label">
            Jugador que entra
          </label>

          <select
            class="form-select"
            id="player-in"
            required
          >

            <option value="">
              Seleccionar
            </option>

          </select>

        </div>


        <!-- BOTONES -->

        <div class="flex gap-md">

          <button
            type="submit"
            class="btn btn-primary"
          >
            Guardar
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            id="close-sub-modal"
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  `;

  document.body.appendChild(modal);


  // CERRAR
  document
    .getElementById("close-sub-modal")
    .addEventListener("click", () => {

      modal.remove();
    });


  // SELECTORES
  const teamSelect =
    document.getElementById("sub-team");

  const outSelect =
    document.getElementById("player-out");

  const inSelect =
    document.getElementById("player-in");


  // CAMBIO EQUIPO
  teamSelect.addEventListener("change", () => {

    const selectedTeamId =
      teamSelect.value;

    const team =
      selectedTeamId === match.localTeam.id
        ? match.localTeam
        : match.awayTeam;


    // JUGADORES EN CAMPO
    const onField =
      team.players.filter(
        p => p.onField
      );

    // SUPLENTES
    const substitutes =
      team.players.filter(
        p => !p.onField
      );


    outSelect.innerHTML = `
      <option value="">
        Seleccionar
      </option>

      ${onField.map(player => `

        <option value="${player.id}">

          #${player.number}
          ${player.name}

        </option>

      `).join("")}
    `;


    inSelect.innerHTML = `
      <option value="">
        Seleccionar
      </option>

      ${substitutes.map(player => `

        <option value="${player.id}">

          #${player.number}
          ${player.name}

        </option>

      `).join("")}
    `;
  });


  // GUARDAR
  document
    .getElementById("sub-form")
    .addEventListener("submit", (e) => {

      e.preventDefault();


      const minute =
        parseInt(
          document
            .getElementById("sub-minute")
            .value
        );

      const selectedTeamId =
        teamSelect.value;

      const team =
        selectedTeamId === match.localTeam.id
          ? match.localTeam
          : match.awayTeam;


      const playerOut =
        team.players.find(
          p => p.id === outSelect.value
        );

      const playerIn =
        team.players.find(
          p => p.id === inSelect.value
        );


      // VALIDACIONES
      if (!playerOut || !playerIn) {

        alert(
          "Debes seleccionar jugadores."
        );

        return;
      }


      if (playerOut.id === playerIn.id) {

        alert(
          "No puede entrar y salir el mismo jugador."
        );

        return;
      }


      if (!playerOut.onField) {

        alert(
          "El jugador que sale no está en el campo."
        );

        return;
      }


      if (playerIn.onField) {

        alert(
          "El jugador que entra ya está en el campo."
        );

        return;
      }


      // ACTUALIZAR ESTADOS
      playerOut.onField = false;

      playerIn.onField = true;


      // EVENTO
      const event = {

        id: crypto.randomUUID(),

        type: "substitution",

        minute,

        teamId: team.id,

        playerOutId: playerOut.id,

        playerOutName: playerOut.name,

        playerInId: playerIn.id,

        playerInName: playerIn.name
      };


      match.events.push(event);

      repository.save(match);

      modal.remove();

      openMatchView(match.id);
    });

  return;
}

      match.events.push(event);

      repository.save(match);

      modal.remove();

      openMatchView(match.id);
    });
}

function renderTimeline(match) {

  const timeline =
    document.getElementById("timeline");

  if (!timeline) return;

  timeline.innerHTML =
    match.events
      ?.sort((a,b) => a.minute - b.minute)
      .map(event => {

        let icon = "⚽";

        if (event.type === "yellow") {
          icon = "🟨";
        }

        if (event.type === "red") {

          if (
            event.redType === "double-yellow"
          ) {

          icon = "🟨🟥";

          } else {

          icon = "🟥";
  }
}

        if (event.type === "substitution") {
          icon = "🔄";
        }

        return `

  <div class="timeline-item">

    <div class="flex-between">

      <strong>

        ${icon}
        ${event.minute}'

      </strong>

      <div class="flex gap-sm">

        <button
          class="btn btn-warning edit-event-btn"
          data-event-id="${event.id}"
        >
          ✏️
        </button>

        <button
          class="btn btn-danger delete-event-btn"
          data-event-id="${event.id}"
        >
          🗑
        </button>

      </div>

    </div>

    <p>

  ${
    event.type === "substitution"
      ? `
        ⬇ ${event.playerOutName}
        <br>
        ⬆ ${event.playerInName}
      `
      : event.playerName
  }

  ${
    event.redType === "double-yellow"
      ? `
        <br>
        <small>
          (Doble amarilla)
        </small>
      `
      : ""
  }

  ${
    event.reason
      ? `
        <br>

        <small class="event-reason">

          Motivo:
          ${event.reason}

        </small>
      `
      : ""
  }

</p>

  </div>
`;
      })
      .join("");
}

function deleteEvent(match, eventId) {

  const confirmed =
    confirm(
      "¿Eliminar evento?"
    );

  if (!confirmed) return;


  const event =
    match.events.find(
      e => e.id === eventId
    );

  if (!event) return;


  // REVERTIR SUSTITUCIÓN
  if (
    event.type === "substitution"
  ) {

    const team =
      event.teamId === match.localTeam.id
        ? match.localTeam
        : match.awayTeam;

    const playerOut =
      team.players.find(
        p => p.id === event.playerOutId
      );

    const playerIn =
      team.players.find(
        p => p.id === event.playerInId
      );

    if (playerOut) {
      playerOut.onField = true;
    }

    if (playerIn) {
      playerIn.onField = false;
    }
  }


  // REVERTIR ROJA
  if (event.type === "red") {

    const team =
      event.teamId === match.localTeam.id
        ? match.localTeam
        : match.awayTeam;

    const player =
      team.players.find(
        p => p.id === event.playerId
      );

    if (player) {
      player.onField = true;
    }
  }


  // BORRAR
  match.events =
    match.events.filter(
      e => e.id !== eventId
    );

  repository.save(match);

  openMatchView(match.id);
}

function editEvent(match, eventId) {

  const event =
    match.events.find(
      e => e.id === eventId
    );

  if (!event) return;


  const newMinute =
    prompt(
      "Nuevo minuto",
      event.minute
    );

  if (
    newMinute === null
  ) return;

  const parsedMinute =
    parseInt(newMinute);

  if (isNaN(parsedMinute)) {

    alert("Minuto inválido");

    return;
  }

  event.minute = parsedMinute;


  // EDITAR MOTIVO
  if (
    event.type === "yellow"
    ||
    event.type === "red"
  ) {

    const reason =
      prompt(
        "Motivo",
        event.reason || ""
      );

    event.reason =
      reason || "";
  }


  repository.save(match);

  openMatchView(match.id);
}

function renderPlayers(match) {

  const localContainer =
    document.getElementById("local-players");

  const awayContainer =
    document.getElementById("away-players");

  localContainer.innerHTML =
    renderPlayerList(
      match,
      match.localTeam
    );

  awayContainer.innerHTML =
    renderPlayerList(
      match,
      match.awayTeam
    );
}

function renderPlayerList(match, team) {

  if (!team.players?.length) {

    return `
      <p>
        Sin jugadores
      </p>
    `;
  }


  // TITULARES
  const starters =
    team.players.filter(
      p => p.starter
    );

  // SUPLENTES
  const substitutes =
    team.players.filter(
      p => !p.starter
    );


  return `

    <!-- TITULARES -->
    <section class="lineup-section">

      <h4 class="lineup-title">
        Titulares
      </h4>

      <div class="player-list">

        ${starters.map(player => `

          <div class="player-item">

            <div class="player-info">

              <div class="player-number">
                ${player.number}
              </div>

              <div>

                <strong>
                  ${player.name}
                </strong>

                <div>

                  ${
                    player.onField
                      ? `
                        <span class="badge badge-success">
                          En campo
                        </span>
                      `
                      : `
                        <span class="badge badge-danger">
                          Fuera
                        </span>
                      `
                  }

                </div>

              </div>

            </div>


            <div class="flex gap-sm">

              <button
                class="btn btn-warning edit-player-btn"
                data-team-id="${team.id}"
                data-player-id="${player.id}"
              >
                ✏️
              </button>

              <button
                class="btn btn-danger delete-player-btn"
                data-team-id="${team.id}"
                data-player-id="${player.id}"
              >
                🗑
              </button>

            </div>

          </div>

        `).join("")}

      </div>

    </section>


    <!-- SUPLENTES -->
    <section class="lineup-section mt-lg">

      <h4 class="lineup-title">
        Suplentes
      </h4>

      <div class="player-list">

        ${substitutes.map(player => `

          <div class="player-item">

            <div class="player-info">

              <div class="player-number">
                ${player.number}
              </div>

              <div>

                <strong>
                  ${player.name}
                </strong>

                <div>

                  ${
                    player.onField
                      ? `
                        <span class="badge badge-success">
                          En campo
                        </span>
                      `
                      : `
                        <span class="badge badge-warning">
                          Suplente
                        </span>
                      `
                  }

                </div>

              </div>

            </div>


            <div class="flex gap-sm">

              <button
                class="btn btn-warning edit-player-btn"
                data-team-id="${team.id}"
                data-player-id="${player.id}"
              >
                ✏️
              </button>

              <button
                class="btn btn-danger delete-player-btn"
                data-team-id="${team.id}"
                data-player-id="${player.id}"
              >
                🗑
              </button>

            </div>

          </div>

        `).join("")}

      </div>

    </section>
  `;
}

function editPlayer(
  match,
  teamId,
  playerId
) {

  const team =
    teamId === match.localTeam.id
      ? match.localTeam
      : match.awayTeam;

  const player =
    team.players.find(
      p => p.id === playerId
    );

  if (!player) return;


  const modal =
    document.createElement("div");

  modal.className =
    "modal-overlay";


  modal.innerHTML = `

    <div class="modal">

      <h2>
        Editar jugador
      </h2>

      <form id="edit-player-form">

        <!-- NOMBRE -->
        <div class="form-group">

          <label class="form-label">
            Nombre
          </label>

          <input
            class="form-input"
            id="edit-player-name"
            value="${player.name}"
            required
          />

        </div>


        <!-- DORSAL -->
        <div class="form-group">

          <label class="form-label">
            Dorsal
          </label>

          <input
            type="number"
            class="form-input"
            id="edit-player-number"
            value="${player.number}"
            required
          />

        </div>


        <!-- TITULAR -->
        <div class="form-group">

          <label>

            <input
              type="checkbox"
              id="edit-player-starter"
              ${
                player.onField
                  ? "checked"
                  : ""
              }
            />

            En campo / Titular

          </label>

        </div>


        <!-- BOTONES -->
        <div class="flex gap-md">

          <button
            type="submit"
            class="btn btn-primary"
          >
            Guardar cambios
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            id="close-edit-player-modal"
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  `;


  document.body.appendChild(modal);


  // CERRAR
  document
    .getElementById(
      "close-edit-player-modal"
    )
    .addEventListener("click", () => {

      modal.remove();
    });


  // GUARDAR
  document
    .getElementById(
      "edit-player-form"
    )
    .addEventListener("submit", (e) => {

      e.preventDefault();


      const newName =
        document
          .getElementById(
            "edit-player-name"
          )
          .value
          .trim();

      const newNumber =
        parseInt(
          document
            .getElementById(
              "edit-player-number"
            )
            .value
        );

      const isStarter =
        document
          .getElementById(
            "edit-player-starter"
          )
          .checked;


      // VALIDACIONES
      if (!newName) {

        alert(
          "Nombre obligatorio."
        );

        return;
      }

      if (isNaN(newNumber)) {

        alert(
          "Dorsal inválido."
        );

        return;
      }


      // DORSAL REPETIDO
      const repeated =
        team.players.some(p =>

          p.number === newNumber
          &&
          p.id !== player.id
        );

      if (repeated) {

        alert(
          "Ese dorsal ya existe."
        );

        return;
      }


      // ACTUALIZAR
      player.name = newName;

      player.number = newNumber;

      player.starter = isStarter;

      player.onField = isStarter;


      repository.save(match);

      modal.remove();

      openMatchView(match.id);
    });
}

function deletePlayer(
  match,
  teamId,
  playerId
) {

  const confirmed =
    confirm(
      "¿Eliminar jugador?"
    );

  if (!confirmed) return;


  const team =
    teamId === match.localTeam.id
      ? match.localTeam
      : match.awayTeam;


  // IMPEDIR SI TIENE EVENTOS
  const hasEvents =
    match.events.some(e =>

      e.playerId === playerId
      ||
      e.playerOutId === playerId
      ||
      e.playerInId === playerId
    );

  if (hasEvents) {

    alert(
      "No puedes eliminar un jugador con eventos registrados."
    );

    return;
  }


  team.players =
    team.players.filter(
      p => p.id !== playerId
    );


  repository.save(match);

  openMatchView(match.id);
}

}

function saveMatch(e, existingMatch = null) {

  e.preventDefault();

  const match = {

    id:
      existingMatch?.id
      || crypto.randomUUID(),

    localTeam: {
      id:
        existingMatch?.localTeam?.id
        || crypto.randomUUID(),

      name:
        document
          .getElementById("local-team")
          .value
    },

    awayTeam: {
      id:
        existingMatch?.awayTeam?.id
        || crypto.randomUUID(),

      name:
        document
          .getElementById("away-team")
          .value
    },

    date:
      document
        .getElementById("match-date")
        .value,

    referee:
      existingMatch?.referee || "",

    location:
      existingMatch?.location || "",

    events:
      existingMatch?.events || [],

    status:
      existingMatch?.status || "Pendiente"
  };

  repository.save(match);

  render();
}

  document
    .querySelectorAll("[data-delete]")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        const confirmed =
          confirm(
            "¿Eliminar partido?"
          );

        if (!confirmed) return;

        repository.delete(
          btn.dataset.delete
        );

        render();
      });
    });

function openMatchForm(match = null) {

  const isEditing = !!match;

  app.innerHTML = `
    <section class="card">

      <h2>
        ${
          isEditing
            ? "Editar Partido"
            : "Nuevo Partido"
        }
      </h2>

      <form id="match-form">

        <div class="form-group">

          <label class="form-label">
            Equipo local
          </label>

          <input
            class="form-input"
            id="local-team"
            required
            value="${
              match?.localTeam?.name || ""
            }"
          />

        </div>

        <div class="form-group">

          <label class="form-label">
            Equipo visitante
          </label>

          <input
            class="form-input"
            id="away-team"
            required
            value="${
              match?.awayTeam?.name || ""
            }"
          />

        </div>

        <div class="form-group">

          <label class="form-label">
            Fecha y hora
          </label>

          <input
            type="datetime-local"
            class="form-input"
            id="match-date"
            required
            value="${
              match?.date || ""
            }"
          />

        </div>

        <div class="flex gap-md">

          <button
            type="submit"
            class="btn btn-primary"
          >
            ${
              isEditing
                ? "Guardar cambios"
                : "Crear partido"
            }
          </button>

          <button
            type="button"
            id="cancel-btn"
            class="btn btn-secondary"
          >
            Cancelar
          </button>

        </div>

      </form>

    </section>
  `;


  // GUARDAR
  document
    .getElementById("match-form")
    .addEventListener(
      "submit",
      (e) => saveMatch(e, match)
    );


  // CANCELAR
  document
    .getElementById("cancel-btn")
    .addEventListener("click", render);
}

document
  .getElementById("toggle-dark")
  .addEventListener("click", () => {

    document.body.classList.toggle("dark");
  });

render();