import express from 'express'
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(cors())

app.get('/api' , (req , res) =>{
    res.send("Smart Hostel Api running")
})

export default app