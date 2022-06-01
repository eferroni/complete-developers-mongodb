const assert = require("assert");
const res = require("express/lib/response");
const request = require("supertest");
const app = require("../../app");
const Driver = require("../../models/driver");

describe("Drivers Controller", () => {
  it("handles a POST request to /api/drivers and creates a new driver", (done) => {
    Driver.count().then((count) => {
      request(app)
        .post("/api/drivers")
        .send({ email: "edu@gmail.com" })
        .end((err, response) => {
          Driver.count().then((newCount) => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it("PUT to /api/drivers/:id edits an existing driver", (done) => {
    const driver = new Driver({ email: "edit@gmail.com", driving: false });
    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end((err, response) => {
          Driver.findOne({ email: "edit@gmail.com" }).then((driver) => {
            assert(driver.driving === true);
            done();
          });
        });
    });
  });

  it("DELETE to /api/drivers/:id can delete a driver", (done) => {
    const driver = new Driver({ email: "delete@gmail.com", driving: false });
    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.find({ email: "delete@gmail.com" }).then((drivers) => {
            assert(drivers.length === 0);
            done();
          });
        });
    });
  });

  it("GET to /api/drivers finds drivers in a location", (done) => {
    const seattleDriver = new Driver({
      email: "seattle@gmail.com",
      geometry: { type: "Point", coordinates: [-122.4759902, 47.6147628] },
    });
    const miamiDriver = new Driver({
      email: "miami@gmail.com",
      geometry: { type: "Point", coordinates: [-80.253, 25.791] },
    });
    Promise.all([seattleDriver.save(), miamiDriver.save()]).then(() => {
      request(app)
        .get("/api/drivers?lng=-80&lat=25")
        .end((err, response) => {
          assert(response.body.length === 1);
          assert(response.body[0].email === "miami@gmail.com");
          done();
        });
    });
  });
});
