const router = require('express').Router()

const { Blog, User, Readinglist } = require('../models')
const { Op } = require("sequelize")
const { tokenExtractor } = require("../util/middleware")

const blogFinder = async(req, res, next) => {
  req.blog =  await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]:`%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]:`%${req.query.search}%`
          }
        }
      ]
    }
  }
  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    attributes: { exclude: ['userId'] },
    include: [{
      model: User,
      attributes: ['name']
    }],
    where
  })
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    console.log(req.blog.toJSON())
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})



router.post('/', tokenExtractor, async (req, res) => {
  console.log('req.decodedToken is', req.decodedToken)
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    return res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
    req.blog.likes += 1
    req.blog.save()
    res.json(req.blog)
})


router.delete('/:id',tokenExtractor, blogFinder, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog.userId == user.id) {
      await req.blog.destroy();
      res.json(req.blog)
    } else return res.status(401).json({ error: 'user not match' })
})

module.exports = router