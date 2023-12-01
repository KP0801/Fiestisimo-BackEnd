const bcryptsjs = require("bcrypt");
const password =require("generate-password");

const encrypt = async (passwordPlain) =>{
    const hash = await bcryptsjs.hash(passwordPlain,10)

    return hash
}

const compare = async (passwordPlain,hashPassword) =>{
    return await bcryptsjs.compare(passwordPlain,hashPassword)
}

const generatePassword = ()=>{
    return password.generate({
        length:12,
        numbers:true,
        uppercase:true
    })
}
module.exports = {
    encrypt,
    compare,
    generatePassword
};
