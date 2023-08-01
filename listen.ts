const app = require("./app")

const port = process.env.PORT || 9091

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
