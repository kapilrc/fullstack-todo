let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')
let app = express()
let db

app.use(express.static('public'))

let connectionString = 'mongodb+srv://TodoAppUser:Passw0rd@cluster0-p4s24.mongodb.net/test?retryWrites=true&w=majority';
mongodb.connect(connectionString, {
  useNewUrlParser: true, 
  autoReconnect: true,
  socketTimeoutMS:500000,
  connectTimeoutMS:500000,
  useUnifiedTopology: true
}, (err, client) => {
  if(err){
    console.error('An error occurred connecting to MongoDB: ', err);
    return
  }

  db = client.db('test')
  
  // allow visitors incoming requests only after successful connection established with DB
  const port = process.env.PORT || 3000;
  app.listen(port)
});

//tells express to automatically take asynchronous request and add it to a body pbject that lives on the request object
app.use(express.json())

//tells express to automatically take submitted form-data and add it to a body pbject that lives on the request object
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple todo App"')
  console.log(req.headers.authorization)
  if(req.headers.authorization === 'Basic YWRtaW46cGFzc3dvcmQ=') {
    next()
  }else {
    res.status(401).send('Authentication required')
  }
}

app.use(passwordProtected)

app.get('/', (req, res) => {
  db.collection('todo-items').find().toArray((err, items) => {
    res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1">To-Do App</h1>
      
      <div class="jumbotron p-3 shadow-sm">
        <form id="todo-form" action="/create-item" method="POST"
          <div class="d-flex align-items-center">
            <input id="input-text" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul id="item-list" class="list-group pb-5">
      </ul>      
    </div>
  
    <script>
      let items = ${JSON.stringify(items)}
    </script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/app.js"></script>
  </body>
  </html>`);
  });
  
})

app.post('/create-item', (req, res) => {
  // console.log(req.body.item);
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributs: {}})
  db.collection('todo-items').insertOne({text: safeText}, (err, info) => {
    res.json(info.ops[0])
    // res.redirect(`/`);
  })
})

app.post('/update-item', (req, res) => {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributs: {}})

  db.collection('todo-items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, () => { 
    res.send('Success')
  })
})

app.post('/delete-item', (req, res) => {
  db.collection('todo-items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, () => {
    res.send('success')
  })
})

// app.get('/create-item', (req, res) => {
//   // console.log(req.body.item);
//   db.collection('todo-items').insert({text: req.body.item}, () => {
//     res.send(`invalid request`);
//   })
// })
