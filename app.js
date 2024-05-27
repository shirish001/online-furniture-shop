const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

const app = express();

app.set("view engine", "ejs"); // this is the default engine
app.set("views", path.join(__dirname, "views")); // this is the default path

app.use(express.static("public"));

//this filtered path is not actually in our project directory structure but its available in Product array objects for each item
//the filtered path is removed as soon as it matches, then the static middleware takes control
//and then it look in the specified folder with the remaining path as new path
app.use("/products/assets", express.static("product-data"));

// middlware
app.use(express.urlencoded({ extended: false })); // to parse url encoded data( for html form submissions)
app.use(express.json()); // to parse json data (for API calls or data sent in json format thru ajax req)

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

// added after session config because it uses session
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);

// also we order this before the protectRoutesMiddleware because we want to items to cart even if not logged in
app.use("/cart", cartRoutes); // only access those routes that start with "/cart", and then the cartRoutes work for rest of that path by removing prefix "/cart"

app.use("/orders", protectRoutesMiddleware, ordersRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes); //// similarly here express removes the /admin prefix once the necessary path is found

app.use(notFoundMiddleware); //// for paths that dont exist, since it handles every req we put protectRoutesMiddleware inside,  cannot place it before them

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
