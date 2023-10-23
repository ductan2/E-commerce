import express from "express"
const router = express.Router()
import env from "dotenv"
env.config()
router.get("/config", (req, res) => {
  return res.status(200).json({
    status: 'OK',
    data: process.env.PAYPAL_CLIENT_ID || 'sb'
  })
})
router.get("/success", (req, res) => {
  
})
export default router;

