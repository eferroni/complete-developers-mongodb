const Driver = require("../models/driver");

module.exports = {
  // just a hi there
  gretting(req, res) {
    res.send({ hi: "there" });
  },

  // create a driver
  create(req, res, next) {
    const driverProps = req.body;
    Driver.create(driverProps)
      .then((driver) => res.send(driver))
      .catch(next);
  },

  // update a driver
  update(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;
    Driver.findByIdAndUpdate(driverId, driverProps)
      .then(() => Driver.findById(driverId))
      .then((driver) => res.send(driver))
      .catch(next);
  },

  // delete a driver
  delete(req, res, next) {
    const driverId = req.params.id;
    Driver.findByIdAndRemove(driverId)
      .then((driver) => res.status(204).send(driver))
      .catch(next);
  },

  // return a list of drivers close to a point
  index(req, res, next) {
    const { lat, lng } = req.query;

    Driver.find({
      "geometry.coordinates": {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [+lng, +lat],
          },
          $maxDistance: 200000,
        },
      },
    })
      .then((drivers) => res.send(drivers))
      .catch(next);
  },
};
