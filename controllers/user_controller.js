var users = {
  admin:  {id: 1, username: "admin",  password: "1234"},
  andres: {id: 2, username: "andres", password: "5678"}
};

// Comprueba si el usuario está registrado en users y si hay errores ejecuta callback

exports.autenticar = function(login, password, callback) {
  if (users[login]) {
    if (password === users[login].password) {
      callback(null, users[login]);
    } else {
      callback(new Error('Password incorrecto.'));
    }
  } else {
    callback(new Error('No existe el usuario.'));
  }
};
