const DriversController = require("../controllers/drivers_controller");

module.exports = (app) => {
  app.get("/api", DriversController.gretting);
  app.post("/api/drivers", DriversController.create);
  app.put("/api/drivers/:id", DriversController.update);
  app.delete("/api/drivers/:id", DriversController.delete);
  app.get("/api/drivers", DriversController.index);
};
