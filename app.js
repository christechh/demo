const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const policyholderRoutes = require("./routes/policyholders");

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(bodyParser());
app.use(policyholderRoutes.routes());
app.use(policyholderRoutes.allowedMethods());

mongoose
  .connect("mongodb://localhost:27017/demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
