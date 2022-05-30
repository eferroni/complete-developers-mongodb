const assert = require("assert");
const User = require("../src/user");

describe("Subdocuments", () => {
  it("can create a subdocument", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "Title 1" }, { title: "Title 2" }],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts.length === 2);
        assert(user.posts[0].title === "Title 1");
        done();
      });
  });

  it("can add a subdocument", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts.length === 0);
        user.posts.push({ title: "Title 1" });
        return user.save();
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts.length === 1);
        assert(user.posts[0].title === "Title 1");
        done();
      });
  });

  it("can remove a subdocument", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "Title 1" }, { title: "Title 2" }],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        user.posts[0].remove();
        return user.save();
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts.length === 1);
        done();
      });
  });
});
