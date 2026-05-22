import { AuthService }
from "./AuthService.js";


export function renderAuth() {

  const root =
    document.getElementById(
      "auth-screen"
    );


  // YA LOGUEADO
  if (
    AuthService.isAuthenticated()
  ) {

    root.innerHTML = "";

    return;
  }


  root.innerHTML = `

<div class="login-screen">

  <div class="login-card">

    <div class="login-header">

      <img
        src="./assets/logo.png"
        alt="Logo"
        class="login-logo"
      />

      <div>

        <h1 class="login-title">
          FFPSJ
        </h1>

        <p class="login-subtitle">
          Federación de Fútbol
          de Playa de San Juan
        </p>

      </div>

    </div>


    <form id="login-form">

      <div class="login-field">

        <input
          type="email"
          id="login-email"
          placeholder="Usuario"
          required
        />

      </div>


      <div class="login-field">

        <input
          type="password"
          id="login-password"
          placeholder="Contraseña"
          required
        />

      </div>


      <button
        type="submit"
        class="login-btn"
      >
        Entrar
      </button>

    </form>

  </div>

</div>
`;


  document
    .getElementById(
      "login-form"
    )
    .addEventListener("submit", e => {

      e.preventDefault();

      try {

        AuthService.login(

          document
            .getElementById(
              "login-email"
            )
            .value,

          document
            .getElementById(
              "login-password"
            )
            .value
        );

        location.reload();

      } catch (err) {

        alert(err.message);
      }
    });
}