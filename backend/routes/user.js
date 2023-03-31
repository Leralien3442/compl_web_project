import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  try {
    const users = await User.findByPk(res.params.userId, { raw: true, nest: true })
    if (users != null) {
      res.json(users)
      res.status(200)
    } else {
      res.status(200)
      res.json('not found')
    }
  } catch (Exception) {
    res.status(404)
  }
})

export default router
