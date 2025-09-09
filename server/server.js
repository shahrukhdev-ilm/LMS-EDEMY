import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './Controllers/webhooks.js'
import { clerkMiddleware } from '@clerk/express'
import educatorRouter from './Routes/educatorRoutes.js'

const app = express()

await connectDB()
app.use(cors())
app.use(clerkMiddleware())

app.get('/', (req, res)=> res.send('API Working'))
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter)

const PORT =  process.env.PORT || 5000
app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)

})