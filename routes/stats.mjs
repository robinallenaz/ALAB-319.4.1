import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/stats", async (req, res) => {
  let collection = await db.collection("grades");

  let result = await collection
    .aggregate([
      {
        $unwind: {
          path: "$scores",
        },
      },
      {
        $group: {
          _id: "$learner_id",
          quiz: {
            $push: {
              $cond: [
                {
                  $eq: ["$scores.type", "quiz"],
                },
                "$scores.score",
                "$$REMOVE",
              ],
            },
          },
          exam: {
            $push: {
              $cond: [
                {
                  $eq: ["$scores.type", "exam"],
                },
                "$scores.score",
                "$$REMOVE",
              ],
            },
          },
          homework: {
            $push: {
              $cond: [
                {
                  $eq: ["$scores.type", "homework"],
                },
                "$scores.score",
                "$$REMOVE",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          learner_id: "$_id",
          avg: {
            $sum: [
              {
                $multiply: [
                  {
                    $avg: "$exam",
                  },
                  0.5,
                ],
              },
              {
                $multiply: [
                  {
                    $avg: "$quiz",
                  },
                  0.3,
                ],
              },
              {
                $multiply: [
                  {
                    $avg: "$homework",
                  },
                  0.2,
                ],
              },
            ],
          },
        },
      },
    ])
    .toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
