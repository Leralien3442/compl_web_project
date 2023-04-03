import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      nest: true,
      include: [
        {
          model: Product,
          as: 'products'
        }, {
          model: Bid,
          as: 'bids',
          attributes: ['id', 'price', 'date'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })
    res.status(200).json(user.toJSON())
  } catch (e) {
    res.status(404).send()
  }
})

export default router
