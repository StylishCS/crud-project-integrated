const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "products management",
});

app.post("/products", (req, res) => {
  const { title, price, taxes, ads, discount, total, category, count } =
    req.body;
  conn.execute(
    `INSERT INTO products (title, price, taxes, ads, discount, total, count, category) values ('${title}','${price}','${taxes}','${ads}','${discount}','${total}','${count}','${category}')`,
    (err) => {
      if (err) {
        return res.json({ message: "error", err });
      }
      return res.json({ message: "Product Added" });
    }
  );
});

app.get("/products", (req, res) => {
  conn.execute("SELECT * FROM products", (err, data) => {
    if (err) return res.json({ message: "error", err });
    res.json({ message: "success", data });
  });
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  conn.execute(`SELECT * FROM products WHERE id=${id}`, (err, data) => {
    if (err) return res.json({ message: "error", err });
    res.json({ message: "success", data });
  });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  conn.execute(`DELETE FROM products WHERE id=${id}`, (err) => {
    if (err) return res.json({ message: "error", err });
    return res.json({ message: "Product Deleted Successfully" });
  });
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { title, price, taxes, ads, discount, total, category, count } =
    req.body;
  conn.execute(
    `UPDATE products SET title='${title}', price=${price}, taxes=${taxes}, ads=${ads}, discount=${discount}, total=${total}, category='${category}' WHERE id=${id}`,
    (err) => {
      if (err) return res.json({ message: "error", err });
      return res.json({ message: "Product updated successfully" });
    }
  );
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
