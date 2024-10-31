const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const apiRoutes = require("./routes/apiRoutes");

app.use(express.json());
app.use("/api/v1", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
