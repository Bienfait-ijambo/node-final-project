const fs = require("fs");
const path = require("path");
const express = require("express");
const slugify = require('slugify')
const postRoutes = express.Router();

function accessPostDBData() {
  const projectFolder = path.resolve(__dirname);
  const postDBPath = path.join(projectFolder, "/postDB.json");
  const data = fs.readFileSync(postDBPath, "utf8");
  return { data, postDBPath };
}




const {generateId,writeDataToDb,VerifyExpressToken,upload}=require('../util/util')



postRoutes.post("/logout", VerifyExpressToken,async function (req, res) {
  
  res.json({ message:"user logged out" }).status(200);
});


postRoutes.get("/check/user/loggedin", VerifyExpressToken,async function (req, res) {
  
  res.json({ success:true }).status(200);
});


postRoutes.get("/count/posts", VerifyExpressToken,async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const posts = JSON.parse(data);
  const count=posts.data.length
  res.json({ data:count }).status(200);
});


postRoutes.post("/posts", VerifyExpressToken,async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const posts = JSON.parse(data);

  const newData = [...posts.data];


    newData.push({
      id:  generateId(),
      title: req.body?.title,
      post_content: req.body?.post_content,
      slug:slugify(req.body?.title),
      image:''
    });
  

  await writeDataToDb(postDBPath,newData)


  res.json({ message: "post created !" }).status(200);
});

postRoutes.put("/posts/:id",VerifyExpressToken, async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const posts = JSON.parse(data);
  const postId=req.params?.id

  const filteredPosts = posts.data.filter(
    (post) => post.id !== parseInt(postId)
  );
  const fileData = {
    data: filteredPosts,
  };

  const newData = [...fileData.data];
  newData.push({
    id: parseInt(postId),
    title: req.body?.title,
    post_content: req.body?.post_content,
    slug:slugify(req.body?.title),
    image:filteredPosts[0]?.image,

  });


  await writeDataToDb(postDBPath,newData)

  res.json({ message: "post updated !" }).status(200);
});







postRoutes.post("/posts/upload-image",VerifyExpressToken, upload.single('image'), async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const posts = JSON.parse(data);
  
  const postId=req.body?.postId

  const toUpdate = posts.data.filter(
    (post) => post.id == parseInt(postId)
  );
  const filteredPosts = posts.data.filter(
    (post) => post.id !== parseInt(postId)
  );
  const fileData = {
    data: filteredPosts,
  };

  const newData = [...fileData.data];
  console.log(toUpdate)
  newData.push({
    id: parseInt(postId),
    title: toUpdate[0]?.title,
    post_content: toUpdate[0]?.post_content,
    slug:slugify(toUpdate[0]?.title),
    image:`http://localhost:3000/${req.file?.filename}`,
  });


  await writeDataToDb(postDBPath,newData)

  res.json({ message: "Image updated !" }).status(200);
});



postRoutes.delete("/posts/:id",VerifyExpressToken, async function (req, res) {
  const { data, postDBPath } = accessPostDBData();

  const postId = req.params?.id;
  const posts = JSON.parse(data);

  const filteredPosts = posts.data.filter(
    (post) => post.id !== parseInt(postId)
  );
 
  await writeDataToDb(postDBPath,filteredPosts)

  res.json({ message: "post deleted successfully !" }).status(200);
});




postRoutes.get("/client/posts",function (req, res) {
  const { data, postDBPath } = accessPostDBData();
  const posts = JSON.parse(data);
  const postArray = posts.data

    res.json(postArray).status(200);
  
});

// VerifyExpressToken
postRoutes.get("/posts",function (req, res) {
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

    res.json({data:filteredposts}).status(200);
  } else {
    res.json({data:posts.data}).status(200);
  }
});



postRoutes.get("/posts/:slug", function (req, res) {
  console.log('f...')
  const slug = req.params?.slug;
  const { getSinglePostBySlug } = require("./singlePost");
  const post = getSinglePostBySlug(slug);
  res.json(post).status(200);
});

module.exports = postRoutes;
