const { VK_User } = require('vkmongo/models');

const validateByEmail = async (req, res) => {
  if(!req.params || !req.params.id){
    return res.status(401).send({
      message: 'Validation error'
    });
  }

  const user = await VK_User.findByIdAndUpdate(req.params.id, {validated: true});
  if(user){
    return res.status(200).send({
      message: 'Validated user'
    });
  }

  return res.status(401).send({
    message: 'Validation error'
  });
}

module.exports = { validateByEmail }