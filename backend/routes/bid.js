import authMiddleware from '../middlewares/auth.js'
import { Bid, Product } from '../orm/index.js'
import express from 'express'
import { getDetails } from '../validators/index.js'
import { Sequelize } from 'sequelize'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  try {
    const bids = await Bid.findByPk(req.params.bidId, { nest: true })
    if (req.user.id === bids.bidderId || req.user.admin) {
      await bids.destroy()
      await bids.save()
      res.status(204).send()
    } else {
      res.status(403).send()
    }
  } catch (e) {
    res.status(404).send()
  }
})

router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  try {
    const bids = await Bid.create({
      productId: req.params.productId,
      price: req.body.price,
      date: Date.now(),
      bidderId: req.user.id
    })
    await bids.save()
    res.status(201).json(bids.toJSON())
  } catch (e) {
    res.status(400).json({ error: 'Invalid or missing fields', details: getDetails(e) })
  }
})

export default router
