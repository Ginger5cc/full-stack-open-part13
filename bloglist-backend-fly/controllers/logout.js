const router = require('express').Router()

const Session = require('../models/session')
const { tokenExtractor } = require("../util/middleware")

router.delete('/', async (req, res) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      let session = await Session.findOne({where: { token : token}})
      if (session) {
        session.expire = true
        session.save()
        res.json(200)
      } 

    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })}
 
})

module.exports = router