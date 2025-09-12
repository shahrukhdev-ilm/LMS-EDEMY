import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './Controllers/webhooks.js'
import { clerkMiddleware } from '@clerk/express'
import educatorRouter from './Routes/educatorRoutes.js'
import connectcloudinary from './configs/cloudinary.js'
import courseRouter from './Routes/courseRoute.js'
import userRouter from './Routes/userRoutes.js'

const app = express()

await connectDB()
await connectcloudinary()
app.use(cors())
app.use(clerkMiddleware())

app.get('/', (req, res)=> res.send('API Working'))
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)

const PORT =  process.env.PORT || 5000
app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`)

})