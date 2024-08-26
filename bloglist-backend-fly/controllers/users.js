const router = require('express').Router()

const { Blog, User, Readinglist } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: {
          attributes: ['id', 'read']
        }
      },
    ]
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error: [error.message]})
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.username = req.body.username
    user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.get('/:id', async (req, res) => {
  let where2 = {}

  if (req.query.read) {
    where2 = 
        {
          read: req.query.read
        }
  }
  
  const user = await User.findOne({
    where :{ id : req.params.id},
    attributes: { exclude: ['createdAt', 'updatedAt']},
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt']},
        through: {
          attributes: ['id', 'read'],
          where: where2
        }
      },
    ]
  }) 
  
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router