const router = require('express').Router()

const { Blog, User } = require('../models')

const blogFinder = async(req, res, next) => {
  req.blog =  await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
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

router.post('/', async (req, res) => {
    const user = await User.findOne()
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
    req.blog.likes += 1
    req.blog.save()
    res.json(req.blog)
})


router.delete('/:id', blogFinder, async (req, res) => {
    await req.blog.destroy();
    res.json(req.blog)
})

module.exports = router