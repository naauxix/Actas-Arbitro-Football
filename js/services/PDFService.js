export class PDFService {

  static generate(match) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;


    // =========================
    // TÍTULO
    // =========================

    doc.setFontSize(22);

    doc.text(
      "ACTA OFICIAL DEL PARTIDO",
      105,
      y,
      { align: "center" }
    );

    y += 15;


    // =========================
    // MARCADOR
    // =========================

    const localGoals =
      match.events.filter(e =>

        e.type === "goal"
        &&
        e.teamId === match.localTeam.id
      ).length;

    const awayGoals =
      match.events.filter(e =>

        e.type === "goal"
        &&
        e.teamId === match.awayTeam.id
      ).length;


    doc.setFontSize(18);

    doc.text(
      `${match.localTeam.name} ${localGoals} - ${awayGoals} ${match.awayTeam.name}`,
      105,
      y,
      { align: "center" }
    );

    y += 15;


    // =========================
    // DATOS PARTIDO
    // =========================

    doc.setFontSize(11);

    doc.text(
      `Fecha: ${new Date(match.date).toLocaleString()}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Estado: ${match.status}`,
      20,
      y
    );

    y += 8;

    if (match.referee) {

      doc.text(
        `Árbitro: ${match.referee}`,
        20,
        y
      );

      y += 8;
    }

    if (match.location) {

      doc.text(
        `Ubicación: ${match.location}`,
        20,
        y
      );

      y += 12;
    }


    // =========================
    // ALINEACIONES
    // =========================

    doc.setFontSize(16);

    doc.text(
      "ALINEACIONES",
      20,
      y
    );

    y += 12;


    PDFService.renderTeam(
      doc,
      match.localTeam,
      20,
      y
    );

    PDFService.renderTeam(
      doc,
      match.awayTeam,
      110,
      y
    );

    y += 90;


    // =========================
    // EVENTOS
    // =========================

    doc.setFontSize(16);

    doc.text(
      "EVENTOS DEL PARTIDO",
      20,
      y
    );

    y += 12;


    match.events
      ?.sort((a,b) => a.minute - b.minute)
      .forEach(event => {

        let label = "GOL";

        if (event.type === "yellow") {
          label = "AMARILLA";
        }

        if (event.type === "red") {

          label =
            event.redType === "double-yellow"
              ? "DOBLE AMARILLA"
              : "ROJA";
        }

        if (event.type === "substitution") {
          label = "SUSTITUCIÓN";
        }


        // =========================
        // TEXTO EVENTO
        // =========================

        let text = "";


        // SUSTITUCIÓN
        if (
          event.type === "substitution"
        ) {

          text =
            `${event.minute}'\n` +
            `Sale: ${event.playerOutName}\n` +
            `Entra: ${event.playerInName}`;

        }

        // RESTO
        else {

          text =
            `${event.minute}'\n` +
            `${event.playerName}`;
        }


        // MOTIVO
if (event.reason) {

  text +=
    `\nMotivo: "${event.reason}"`;
}


        // =========================
        // LABEL
        // =========================

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(12);

        doc.text(
          label,
          20,
          y
        );

        y += 6;


        // =========================
        // CONTENIDO
        // =========================

        doc.setFont(
          "times",
          "normal"
        );

        doc.setFontSize(11);

        const lines = text.split("\n");

lines.forEach((line, index) => {

  // MOTIVO EN CURSIVA
  if (line.startsWith("Motivo:")) {

    doc.setFont(
      "times",
      "italic"
    );

  } else {

    doc.setFont(
      "times",
      "normal"
    );
  }

  doc.text(
    line,
    25,
    y
  );

  y += 6;
});

        y += 6;


        // NUEVA PÁGINA
        if (y > 260) {

          doc.addPage();

          y = 20;
        }

      });


    // =========================
    // PIE
    // =========================

    doc.setFontSize(10);

    doc.text(
      "Acta oficial de la Federación de Fútbol Playa De San Juan",
      105,
      y,
      { align: "center" }
    );


    // =========================
    // DESCARGAR
    // =========================

    doc.save("acta.pdf");
  }



  // =========================
  // RENDER EQUIPO
  // =========================

  static renderTeam(
    doc,
    team,
    x,
    startY
  ) {

    let y = startY;


    // NOMBRE EQUIPO
    doc.setFontSize(13);

    doc.text(
      team.name,
      x,
      y
    );

    y += 10;


    // TITULARES
    doc.setFontSize(11);

    doc.text(
      "Titulares",
      x,
      y
    );

    y += 8;


    const starters =
      team.players.filter(
        p => p.starter
      );


    starters.forEach(player => {

      doc.text(
        `${player.number} - ${player.name}`,
        x + 5,
        y
      );

      y += 6;
    });


    y += 5;


    // SUPLENTES
    doc.text(
      "Suplentes",
      x,
      y
    );

    y += 8;


    const substitutes =
      team.players.filter(
        p => !p.starter
      );


    substitutes.forEach(player => {

      doc.text(
        `${player.number} - ${player.name}`,
        x + 5,
        y
      );

      y += 6;
    });
  }

}