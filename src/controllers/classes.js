const classesController = module.exports;
const privileges = require('../privileges');

classesController.get = async function (req, res, next) {
    let uid = parseInt(req.uid);
    let isTeacher = await privileges.users.isTeacher(uid);
    if (!isTeacher) {
        return res.redirect('/');
    }
    res.render("sdlms/classes", { title: "classes", message: "hello this is working" });
};
