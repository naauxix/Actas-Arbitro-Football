import { MatchService } from "../services/MatchService.js";

export function HomeView(matches) {

  return `
    <section>

      <button id="new-match">
        ➕ Nuevo Partido
      </button>

      <input
        id="search"
        placeholder="Buscar equipo..."
        aria-label="Buscar partido"
      />

      ${matches.map(match => {

        const score =
          MatchService.calculateScore(match);

        return `
          <article
            class="card match-card"
            data-open="${match.id}"
            >

            <h2>
              ${match.localTeam.name}
              ${score.localGoals}
              -
              ${score.awayGoals}
              ${match.awayTeam.name}
            </h2>

            <p>
              ${new Date(match.date)
                .toLocaleString()}
            </p>

            <p>Estado: ${match.status}</p>

            <button data-edit="${match.id}">
              Editar
            </button>

            <button data-delete="${match.id}">
              Eliminar
            </button>

          </article>
        `;
      }).join("")}

    </section>
  `;
}