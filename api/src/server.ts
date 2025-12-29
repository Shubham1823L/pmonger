import express from 'express'
import cors from 'cors'

import responseHandler from './utils/responseHandler'
import errorMiddleware from './middlewares/errorMiddleware'

import authRoutes from './routes/authRoutes'
import productRoutes from './routes/authRoutes'
import env from './config/env'


const app = express()


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json())
app.use(responseHandler)


app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)


app.use(errorMiddleware)


app.listen(env.PORT || 8080, () => {
    console.log(`Listening on port ${env.PORT || 8080}`)
})