const customPageController = module.exports;

customPageController.get = async function (req, res, next) {
    res.render("sdlms/customPage", { title: "custom Page", message: "hello this is working" });
};