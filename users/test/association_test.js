const mongoose = require("mongoose");
const assert = require("assert");
const User = require("../src/user");
const Comment = require("../src/comment");
const BlogPost = require("../src/blogPost");

describe("Associations", () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name: "Joe" });
    blogPost = new BlogPost({ title: "Title 1", content: "Content 1" });
    comment = new Comment({ content: "Comment 1" });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() =>
      done()
    );
  });

  it("saves a relation between a user and a blogPost", (done) => {
    User.findOne({ name: "Joe" })
      .populate("blogPosts")
      .then((user) => {
        assert(user.blogPosts[0].title === "Title 1");
        done();
      });
  });

  it("saves a full relation graph", (done) => {
    User.findOne({ name: "Joe" })
      .populate({
        path: "blogPosts",
        model: "blogPost",
        populate: {
          path: "comments",
          model: "comment",
          populate: {
            path: "user",
            model: "user",
          },
        },
      })
      .then((user) => {
        const firstBlogPost = user.blogPosts[0];
        assert(user.name === "Joe");
        assert(firstBlogPost.title === "Title 1");
        assert(firstBlogPost.comments[0].content === "Comment 1");
        assert(firstBlogPost.comments[0].user.name === "Joe");
        done();
      });
  });
});
