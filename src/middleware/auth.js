// verificando admin

export function soloAdmin(req,res,next){
    if(req.user.rol === "admin"){
        next()
    }else{
        res.status(403).send("Acceso denegado, lugar solo de admins")
    }
}

// verificando user
export function soloUser(req,res,next){
    if(req.user.rol === "user"){
        next()
    }else{
        res.status(403).send("Acceso denegado, lugar solo de gente comun y corriente")
    }
}