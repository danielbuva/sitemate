import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const port = 8000;

app.use(express.json());

app.use(cors());

app.get("/", async (_, res) => {
  const allIssues = await prisma.issue.findMany();
  console.log({ AllIssues: allIssues });
  res.json(allIssues);
});

app.get(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.string(),
    }),
  }),
  async (req, res) => {
    const issue = await prisma.issue.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    console.log(issue);
    res.json(issue);
  }
);

app.post(
  "/",
  validateRequest({
    body: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  }),
  async (req, res) => {
    console.log(req.body);

    await prisma.issue.create({
      data: req.body,
    });

    res.json({ message: "success" });
  }
);

app.put(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  }),
  async (req, res) => {
    console.log(req.body);

    await prisma.issue.update({
      where: { id: parseInt(req.params.id) },
      data: { title: req.body.title, description: req.body.description },
    });

    res.json({ message: "success" });
  }
);

app.delete(
  "/:id",
  validateRequest({
    params: z.object({
      id: z.string(),
    }),
  }),
  async (req, res) => {
    await prisma.issue.delete({ where: { id: parseInt(req.params.id) } });

    res.json({ message: "success" });
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
