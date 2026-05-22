const USERS_KEY = "acta_users";

const SESSION_KEY = "acta_session";


export class AuthService {

  // =========================
  // REGISTRO
  // =========================

  static register({

    name,
    email,
    password

  }) {

    const users =
      JSON.parse(
        localStorage.getItem(
          USERS_KEY
        ) || "[]"
      );


    // EMAIL REPETIDO
    const exists =
      users.some(
        u => u.email === email
      );

    if (exists) {

      throw new Error(
        "Ese correo ya existe."
      );
    }


    const user = {

      id: crypto.randomUUID(),

      name,

      email,

      password,

      role: "referee",

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
    email,
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

        u.email === email
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

  //Usuario por defecto
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

    email: "ffpsj@test.com",

    password: "1234",

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