const express = require('express');
const app = express();
const routers = require('./routers');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(routers);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
