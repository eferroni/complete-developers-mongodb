const assert = require("assert");
const User = require("../src/user");

describe("Updating a user", () => {
  let joe;
  beforeEach((done) => {
    joe = new User({ name: "Joe", postCount: 0 });
    joe.save().then(() => done());
  });

  function assertName(operation, done) {
    operation
      .then(() => User.findOne({ id: joe.id }))
      .then((user) => {
        assert(user.name === "Alex");
        done();
      });
  }

  it("instance set and save", (done) => {
    joe.set("name", "Alex");
    assertName(joe.save(), done);
  });

  it("A model instance can update", (done) => {
    assertName(joe.update({ name: "Alex" }), done);
  });

  it("class update", (done) => {
    assertName(User.updateOne({ id: joe.id }, { name: "Alex" }), done);
  });

  it("class findOneAndUpdate", (done) => {
    assertName(User.findOneAndUpdate({ name: "Joe" }, { name: "Alex" }), done);
  });

  it("class findByIdAndUpdate", (done) => {
    assertName(User.findByIdAndUpdate(joe.id, { name: "Alex" }), done);
  });

  it("A user can have their likes incremented by 1", (done) => {
    User.updateMany({ name: "Joe" }, { $inc: { likes: 1 } })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.likes === 1);
        done();
      });
  });
});
