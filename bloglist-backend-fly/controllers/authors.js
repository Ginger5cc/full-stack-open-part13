const router = require('express').Router()

const { Blog, User } = require('../models')

const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("count", sequelize.col("id")), "articles"],
      [sequelize.fn("sum", sequelize.col("likes")), "total_likes"],
    ],
    group: ["author"],
    order: [['total_likes', 'DESC']]
  })
  res.json(blogs)
})


module.exports = router