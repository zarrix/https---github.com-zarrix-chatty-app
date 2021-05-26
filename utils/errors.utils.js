module.exports.registerErrors = (err) => {
    let errors = { pseudo: "", firstName:"",lastName:"",email: "", password: "" };

    if (err.message.includes("pseudo"))
      errors.pseudo = "Pseudo incorrect ";
      if (err.message.includes("firstName"))
      errors.firstName = "FirstName incorrect ";
      if (err.message.includes("lastName"))
      errors.lastName = "LastName incorrect ";
  
    if (err.message.includes("email")) errors.email = "Email incorrect";
  
    if (err.message.includes("password"))
      errors.password = "Le mot de passe doit faire 6 caractères minimum";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
      errors.pseudo = "Ce pseudo est déjà pris";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Cet email est déjà enregistré";
  
    return errors;
}

module.exports.loginErrors = (err)=>{
    let errors = {email:'' , password:''};
    if(err.message.includes("email")) errors.email = "Email inconnu";
    if(err.message.includes("password")) errors.password = "mot de passe incorrecte";
    return errors;
}

//show error of uploading file 
module.exports.uploadErrors = (err) => {
  let errors = { format: '', maxSize: ""};

  if (err.message.includes('invalid file'))
    errors.format = "Format incompatabile";

  if (err.message.includes('max size'))
    errors.maxSize = "Le fichier dépasse 800ko";

  return errors
}