const USERS_KEY = "acta_users";

const SESSION_KEY = "acta_session";


export class AuthService {

  // =========================
  // REGISTRO
  // =========================

  static register({

    name,
    username,
    password,
    secretCode

  }) {

    const users =
      JSON.parse(
        localStorage.getItem(
          USERS_KEY
        ) || "[]"
      );


    // USERNAME REPETIDO
    const exists =
      users.some(
        u => u.username === username
      );

    if (exists) {

      throw new Error(
        "Ese usuario ya existe."
      );
    }

    // =========================
// ROLES SEGÚN CÓDIGO
// =========================

let role = null;


if (secretCode === "2674") {

  role = "admin";
}

else if (
  secretCode === "5798"
) {

  role = "referee";
}

else {

  throw new Error(
    "Código federativo inválido."
  );
}


    const user = {

      id: crypto.randomUUID(),

      name,

      username,

      password,

      role,

      createdAt:
        new Date().toISOString()
    };


    users.push(user);

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );


    return user;
  }



  // =========================
  // LOGIN
  // =========================

  static login(
    username,
    password
  ) {

    const users =
      JSON.parse(
        localStorage.getItem(
          USERS_KEY
        ) || "[]"
      );


    const user =
      users.find(u =>

        u.username === username
        &&
        u.password === password
      );


    if (!user) {

      throw new Error(
        "Credenciales inválidas."
      );
    }


    // GUARDAR SESIÓN
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(user)
    );


    return user;
  }



  // =========================
  // LOGOUT
  // =========================

  static logout() {

    localStorage.removeItem(
      SESSION_KEY
    );

    location.reload();
  }



  // =========================
  // SESIÓN ACTUAL
  // =========================

  static currentUser() {

    return JSON.parse(
      localStorage.getItem(
        SESSION_KEY
      )
    );
  }



  // =========================
  // USUARIO ADMIN POR DEFECTO
  // =========================

  static seedAdmin() {

    const users =
      JSON.parse(
        localStorage.getItem(
          USERS_KEY
        ) || "[]"
      );

    if (users.length > 0) return;

    users.push({

      id: crypto.randomUUID(),

      name: "Administrador",

      username: "ffpsj",

      password: "administrator",

      role: "admin"
    });

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );
  }



  // =========================
  // AUTENTICADO
  // =========================

  static isAuthenticated() {

    return !!this.currentUser();
  }
}