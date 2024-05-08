const fs = require("fs");
const path = require("path");
const express = require("express");
const postRoutes = express.Router();

function accessPostDBData() {
  const projectFolder = path.resolve(__dirname);
  const postDBPath = path.join(projectFolder, "/postDB.json");
  const data = fs.readFileSync(postDBPath, "utf8");
  return {data,postDBPath};
}



postRoutes.post("/posts", function (req, res) {
  const {data,postDBPath} = accessPostDBData();

  const posts = JSON.parse(data);

  const lastItem = posts.data.length;

  const newData = [...posts.data];
  newData.push({
    postId: lastItem + 2,
    title: req.body?.title,
    content: req.body?.content,
  });

  fs.writeFile(postDBPath, JSON.stringify({ data: newData }), "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data has been written to file successfully.");
    }
  });

  res.json({ message: "post created !" }).status(200);
});

postRoutes.delete("/posts/:id", function (req, res) {
  const {data,postDBPath}  = accessPostDBData();

  const postId = req.params?.id;
  const posts = JSON.parse(data);

  const filteredPosts = posts.data.filter(
    (post) => post.postId !== parseInt(postId)
  );
  const fileData = {
    data: filteredPosts,
  };

  fs.writeFile(postDBPath, JSON.stringify(fileData), "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data has been written to file successfully.");
    }
  });

  res.json({ message: "post deleted successfully !" }).status(200);
});

postRoutes.get("/posts", function (req, res) {
  const {data,postDBPath}  = accessPostDBData();
  const posts = JSON.parse(data);
  res.json(posts.data).status(200);
});

postRoutes.get("/posts/:id", function (req, res) {
  const postId = req.params?.id;
  const { getSinglePost } = require("./api/post/singlePost");
  const post = getSinglePost(parseInt(postId));
  res.json(post).status(200);
});

module.exports = postRoutes;
