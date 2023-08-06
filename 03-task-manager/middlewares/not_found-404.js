const notfound= (req,res)=>res.status(404).send("Route does not exist")

//This is another middleware function, so it has access to both request and response (and next too)
module.exports=notfound;