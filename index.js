const express = require('express')
const app = express()
const http = require('http')

/*Initialize Header or Something*/
const compression = require('compression')
const fs = require('fs')
const newFs = require('fs-extra')
const path = require('path')

const helmet = require('helmet')
const cookie = require('cookie-parser')
const cors = require('cors')

const { urlencoded, json } = require('body-parser')
/*End Initialize*/

app.use(compression())
app.use(helmet())
app.use(cookie())
// app.use(cors())
app.use(urlencoded({extended: true}))
app.use(json())

const server = http.createServer(app)

const pathFile = './Source'

app.get('/', (req, res) => {
	res.send('Index Page')
})
app.use('/upload', require('./Upload.js'))

server.listen(9000, () => {
	console.log('PORT 9000')
})