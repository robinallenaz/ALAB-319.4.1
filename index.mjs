import express from "express";

import db from "./db/conn.mjs";

const PORT = 3000;
const app = express();

import grades from "./routes/grades.mjs";
import grades_agg from "./routes/grades_agg.mjs";
import stats from "./routes/stats.mjs";

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Welcome to the API.");
// });

app.get("/", async (req, res) => {
  let collection = db.collection("grades");
  let newDocument = {
    learner_id: 1,
    class_id: 301,
  };
  let result = await collection.insertOne(newDocument).catch((e) => {
    return e.errInfo.details.schemaRulesNotSatisfied;
  });
  res.send(result).status(204);
  // res.send("Welcome to the API.");
});

app.use("/grades", stats);
app.use("/grades", grades);
app.use("/grades", grades_agg);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
