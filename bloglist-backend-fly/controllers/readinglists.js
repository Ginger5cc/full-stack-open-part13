const router = require('express').Router()

const { Blog, User, Readinglist } = require('../models')

const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const readinglists = await Readinglist.findAll({})
  res.json(readinglists)
})

router.post('/', async (req, res) => {
  try {
    const readinglist = await Readinglist.create(req.body)
    res.json(readinglist)
  } catch(error) {
    return res.status(400).json({ error: [error.message]})
  }
})


router.put('/:id', async (req, res) => {
  const readinglist = await Readinglist.findByPk(req.params.id)
  readinglist.read = req.body.read
  readinglist.save()
  res.json(readinglist)
})

router.delete('/:id', async (req, res) => {
  const readinglist = await Readinglist.findByPk(req.params.id)
  await readinglist.destroy();
  res.json(readinglist)
})


module.exports = router