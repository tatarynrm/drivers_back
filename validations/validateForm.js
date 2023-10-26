const Yup = require("yup");
const forrmSchema = Yup.object({
  login: Yup.string()
    .required("Username required")
    .min(6, "Username to short")
    .max(20, "Username to long"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password to short")
    .max(20, "Password to long"),
});
const validateForm = (req, res, next) => {
  const formData = req.body;
  forrmSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).send();
    })
    .then((valid) => {
      if (valid) {
        console.log("from is good");
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = validateForm;
