import express from "express";
import "dotenv/config";
import logger from "../logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logOject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logOject));
      },
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());

let data = [];
let nextId = 1;

// Add Data
app.post("/data", (req, res) => {
  logger.warn("A post request was made to add data.");
  const { name, price } = req.body;
  const newData = { id: nextId++, name, price };
  data.push(newData);
  res.status(201).send(newData);
});

// Get Data
app.get("/data", (req, res) => {
  res.status(200).send(data);
});

// Get Data by ID
app.get("/data/:id", (req, res) => {
  const dataItem = data.find((item) => item.id === parseInt(req.params.id));
  if (!dataItem) {
    return res.status(404).send("Data not found");
  } else {
    res.status(200).send(dataItem);
  }
});

// Update Data
app.put("/data/:id", (req, res) => {
  const dataItem = data.find((item) => item.id === parseInt(req.params.id));
  if (!dataItem) {
    return res.status(404).send("Data not found");
  }

  const { name, price } = req.body;
  dataItem.name = name;
  dataItem.price = price;

  res.status(200).send(dataItem);
});

// Delete data by id
app.delete("/data/:id", (req, res) => {
  const dataItem = data.find((item) => item.id === parseInt(req.params.id));
  if (!dataItem) {
    return res.status(404).send("Data not found");
  }
  data = data.filter((item) => item.id !== parseInt(req.params.id));
  res.status(204).send(dataItem);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
