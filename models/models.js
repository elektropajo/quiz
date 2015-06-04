var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD sqlite3
var sequelize = new Sequelize(  null,
                                null,
                                null,
                                {dialect: "sqlite", storage:"quiz.sqlite"}
                              );
// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Exportar definición de tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa la tabla de preguntas de la BBDD
sequelize.sync().success(function() {
  // success(...) ejecuta el manejador una vez creada la tabla
  Quiz.count().success(function(count) {
    if (count === 0) { //la tabla se inicializa sólo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'
                    })
      .success(function() {
        console.log('Base de datos inicializada.');
      });
    };
  });
});
