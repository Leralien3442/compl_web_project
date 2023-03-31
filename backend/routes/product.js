import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'
import { Sequelize } from "sequelize";
import jwt from "jsonwebtoken";

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  res.json(await Product.findAll({
    nest: true,
    include: [{
      model: User,
      as: 'seller',
      attributes: ['id', 'username']
    }, {
      model: Bid,
      as: 'bids',
      attributes: ['id', 'price', 'date']
    }]
  }))
})

router.get('/api/products/:productId', async (req, res) => {
  try {
    const product = Product.findByPk(req.params.productId, { nest: true })
    res.status('200').json((await product).toJSON())
  } catch (e) {
    res.status('404').send()
  }
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      originalPrice: req.body.originalPrice,
      endDate: req.body.endDate,
      pictureUrl: req.body.pictureUrl,
      sellerId: req.user.id
    })
    await product.save()
    res.status(201).json(product.toJSON())
  } catch (e) {
    res.status(400).json({ error: 'Invalid or missing fields', details: getDetails(e) })
  }
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
