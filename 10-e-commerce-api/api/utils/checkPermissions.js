const CustomError= require('../errors');


const checkPermissions=(requestUser,resourceUserId)=>{  //requestUser is the user trying to get access. resourceUserId is the id (Object) of an user that requestUser wants to know about.

    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);

   
    if(requestUser.role=='admin') return;                       //In case of admin grant access
    if(requestUser.userId==resourceUserId.toString()) return;   //If some user is trying to access with his own id, grant access 

    throw new CustomError.UnauthorizedError('Not Authorized To Access This Route'); //Otherwise, throw Error
}

module.exports= checkPermissions;

