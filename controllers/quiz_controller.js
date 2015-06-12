var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
    where: {id: Number(quizId) },
    include: [{ model: models.Comment }]
  })
  .then(function (quiz) {
    if (quiz) {
      req.quiz = quiz;
      next();
    } else {
      next(new Error('No existe quizId=' + quizId));
    }
  });
}

// GET /quizes
exports.index = function(req, res) {
  if (req.query.search) {
    var search = req.query.search;
    search = "%" + search.trim().replace(/ /g, "%") + "%";
    models.Quiz.findAll({
      where: {
        pregunta: {
          $like: '%' + search
        }
      },
      order: ['pregunta']
    })
    .then(function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, search: req.query.search });
    });
  } else {
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, search: '' });
    });
  }
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};

// GET /quizes/new
exports.new = function (req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    { pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema" }
  );
  res.render('quizes/new', {quiz: quiz});
}

// POST /quizes/create
exports.create = function (req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz.validate().then(function (err) {
    if(err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors} );
    } else {
      quiz
        .save({ fields: ["pregunta", "respuesta", "tema"] })
        .then( function() { res.redirect('/quizes'); });
    }
  });
}

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; //Autoload
  res.render('quizes/edit', { quiz: quiz, errors: [] });
}

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
  req.quiz
  .validate()
  .then(function(err) {
    if (err) {
      res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
    } else {
      req.quiz
      .save({ fields: ["pregunta", "respuesta", "tema"] })
      .then(function() { res.redirect('/quizes'); });
    }
  });
}

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz
  .destroy()
  .then(  function()      { res.redirect('/quizes');  })
  .catch( function(error) { next(error);              });
}
