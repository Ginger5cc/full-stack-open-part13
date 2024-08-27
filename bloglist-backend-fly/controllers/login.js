const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disable) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  
  const newSession = {
    userid : user.id,
    token: token,
    expire: false
  }

  let session = await Session.findOne({where: { userid: user.id}})
  console.log('session Before is', session)
  if (!session) {
    await Session.create(newSession)
  } else if ( session.token == token &&  session.expire) {
    return response.status(401).json({
      error: 'token expire'
    })
  } else {
    session.token = token
    session.expire = false
    session.save()
  }
  

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router