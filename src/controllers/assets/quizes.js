
const quizesController = module.exports;

quizesController.get = async function (req, res, next) {   
    res.render("sdlms/assets/quizes/index", { title: "Quizzes" });
};
quizesController.manage = async function (req, res, next) {   
    res.render("sdlms/assets/quizes/manage", { title: "Quizzes" });
};
