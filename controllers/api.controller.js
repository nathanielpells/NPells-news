const { fetchEndpointDescriptions } = require("../models/api.model.js");

exports.getEndpoints = (req, res, next) => {
  fetchEndpointDescriptions()
    .then((descriptions) => {
      res.status(200).send({ descriptions });
    })
    .catch((err) => {
      next(err);
    });
};
