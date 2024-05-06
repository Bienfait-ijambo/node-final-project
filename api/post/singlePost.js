const fs = require('fs');
const path = require('path');


function getSinglePost(postId){
try {
    
    const projectFolder = path.resolve(__dirname);
    const postDBPath = path.join(projectFolder, 'postDB.json');
    const data=fs.readFileSync(postDBPath,'utf8')
    const posts=JSON.parse(data)
 
    const selectedPost=posts.data.filter((post)=>post.postId===postId)
    return selectedPost
} catch (error) {
    console.log(error.message);
}

}

module.exports = {getSinglePost}


