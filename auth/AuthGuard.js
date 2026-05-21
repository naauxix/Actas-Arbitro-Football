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

    <div class="auth-container">

      <div class="auth-card">

        <h1>
          ActaFútbol
        </h1>

        <p>
          Iniciar sesión
        </p>

        <form id="login-form">

          <input
            type="email"
            placeholder="Correo"
            id="login-email"
            class="form-input"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            id="login-password"
            class="form-input"
            required
          />

          <button
            class="btn btn-primary w-full"
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