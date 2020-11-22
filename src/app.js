require('dotenv').config()
let express = require('express')
let morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
let { NODE_ENV } = require('./config')
let bookmarkRouter = require('./bookmark/bookmark-router')
const validateBearerToken = require('./validate-bearer-token')
let errorHandler = require('./error-handler')



const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';


app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bookmarkRouter)
app.use(validateBearerToken)
app.use(errorHandler)



app.get('/', (req, res) => {
  res.send('Hello, world!')
})






module.exports = app