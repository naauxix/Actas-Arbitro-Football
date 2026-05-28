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
          type="text"
          id="login-username"
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

      <p class="register-link">

  ¿No tienes cuenta?

  <button
    type="button"
    id="show-register"
  >
    Registrarse
  </button>

</p>

    </form>

    <div
  id="register-modal"
  class="modal-overlay hidden"
>

  <div class="modal">

    <h2>
      Crear cuenta
    </h2>

    <form id="register-form">

      <div class="form-group">

        <label class="form-label">
          Nombre
        </label>

        <input
          type="text"
          id="register-name"
          class="form-input"
          required
        />

      </div>


      <div class="form-group">

        <label class="form-label">
          Usuario
        </label>

        <input
          type="text"
          id="register-username"
          class="form-input"
          required
        />

      </div>


      <div class="form-group">

        <label class="form-label">
          Contraseña
        </label>

        <input
          type="password"
          id="register-password"
          class="form-input"
          required
        />

      </div>

      <div class="form-group">

  <label class="form-label">
    Código federativo
  </label>

  <input
    type="password"
    id="register-secret"
    class="form-input"
    placeholder="Código de acceso"
    required
  />

</div>


      <div class="flex gap-sm">

        <button
          type="submit"
          class="btn btn-primary"
        >
          Crear cuenta
        </button>

        <button
          type="button"
          id="close-register"
          class="btn btn-secondary"
        >
          Cancelar
        </button>

      </div>

    </form>

  </div>

</div>

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
              "login-username"
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
    // ABRIR MODAL
document
  .getElementById(
    "show-register"
  )
  .addEventListener("click", () => {

    document
      .getElementById(
        "register-modal"
      )
      .classList.remove("hidden");
  });


// CERRAR MODAL
document
  .getElementById(
    "close-register"
  )
  .addEventListener("click", () => {

    document
      .getElementById(
        "register-modal"
      )
      .classList.add("hidden");
  });
document
  .getElementById(
    "register-form"
  )
  .addEventListener("submit", e => {

    e.preventDefault();

    try {

      AuthService.register({

        name:
          document
            .getElementById(
              "register-name"
            )
            .value,

        username:
          document
            .getElementById(
              "register-username"
            )
            .value,

        password:
          document
            .getElementById(
              "register-password"
            )
            .value,
        
        secretCode:
  document
    .getElementById(
      "register-secret"
    )
    .value
    
      });

      alert(
        "Cuenta creada correctamente"
      );

      document
        .getElementById(
          "register-modal"
        )
        .classList.add("hidden");

    } catch (err) {

      alert(err.message);
    }
  });
}