const fs = require("fs");
const path = require("path");
const express = require("express");
const postRoutes = express.Router();

function accessPostDBData() {
  const projectFolder = path.resolve(__dirname);
  const postDBPath = path.join(projectFolder, "/postDB.json");
  const data = fs.readFileSync(postDBPath, "utf8");
  return { data, postDBPath };
}




const {generateId,writeDataToDb}=require('../util/util')

postRoutes.post("/posts", async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const posts = JSON.parse(data);

  const newData = [...posts.data];


    newData.push({
      postId:  generateId(),
      title: req.body?.title,
      post_content: req.body?.post_content,
    });
  

  await writeDataToDb(postDBPath,newData)


  res.json({ message: "post created !" }).status(200);
});

postRoutes.put("/posts/:id", async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const posts = JSON.parse(data);
  const postId=req.params?.id

  const filteredPosts = posts.data.filter(
    (post) => post.postId !== parseInt(postId)
  );
  const fileData = {
    data: filteredPosts,
  };

  const newData = [...fileData.data];
  newData.push({
    postId: parseInt(postId),
    title: req.body?.title,
    post_content: req.body?.post_content,
  });


  await writeDataToDb(postDBPath,newData)

  res.json({ message: "post updated !" }).status(200);
});

postRoutes.delete("/posts/:id", async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const postId = req.params?.id;
  const posts = JSON.parse(data);

  const filteredPosts = posts.data.filter(
    (post) => post.postId !== parseInt(postId)
  );
 
  await writeDataToDb(postDBPath,filteredPosts)

  res.json({ message: "post deleted successfully !" }).status(200);
});



postRoutes.get("/posts", function (req, res) {
  const { data, postDBPath } = accessPostDBData();
  const query = req.query?.query;
  const posts = JSON.parse(data);

  if (typeof query !== "undefined" && query !== "") {
    const filteredposts = [];
    for (const post of posts?.data) {
      const title = post?.title.toLocaleLowerCase();
      const queryTolowerCase = query.toLowerCase();

      if (title.includes(queryTolowerCase)) {
        filteredposts.push(post);
      }
    }

    res.json(filteredposts).status(200);
  } else {
    res.json(posts.data).status(200);
  }
});

postRoutes.get("/posts/:id", function (req, res) {
  const postId = req.params?.id;
  const { getSinglePost } = require("./singlePost");
  const post = getSinglePost(parseInt(postId));
  res.json(post).status(200);
});

module.exports = postRoutes;
