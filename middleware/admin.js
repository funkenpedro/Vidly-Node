module.exports = function (req, res, next) {
  console.log(req.user.isAdmin, req);
  if (!req.user.isAdmin) return res.status(403).send("admin access denied"); // forbidden
  next();
};
//use an array in route definitions for multiple middlewares
//for example:
//router.delete("/:id", [auth, admin], async (req, res) => {...
