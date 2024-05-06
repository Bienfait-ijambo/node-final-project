

function getSingleById(users,userId){
    const selectedUser=users.filter((user)=>user.id===userId)
    return selectedUser
}


function getSingleByEmail(users,email){
    const selectedUser=users.filter((user)=>user.email===email)
    return selectedUser
}

module.exports = {getSingleById,getSingleByEmail}