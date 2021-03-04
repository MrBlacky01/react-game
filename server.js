const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3001

//app.use('/', express.static(path.join(__dirname, 'dist')))
if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('dist'));
  
    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    })
};
app.listen(port, () => console.log("Listening on Port", port));