//Import required libraries
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";


//New Express app
const serverapp = express();

const prisma = new PrismaClient();

//Parses JSON body from incoming API requests
serverapp.use(express.json());

//Adds CORS supprt
serverapp.use(cors());


//Get
serverapp.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

//Post
serverapp.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;
  
    if (!title || !content) {
      return res.status(400).send("title and content fields required");
    }
  
    try {
      const note = await prisma.note.create({
        data: { title, content },
      });
      res.json(note);
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
  });

  //Put
  serverapp.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id);
  
    if (!title || !content) {
      return res.status(400).send("title and content fields required");
    }
  
    if (!id || isNaN(id)) {
      return res.status(400).send("ID must be a valid number");
    }
  
    try {
      const updatedNote = await prisma.note.update({
        where: { id },
        data: { title, content },
      });
      res.json(updatedNote);
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
  });

//Delete
serverapp.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
  
    if (!id || isNaN(id)) {
      return res.status(400).send("ID field required");
    }
  
    try {
      await prisma.note.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Oops, something went wrong");
    }
  });


//Starts the server listening on port 5000
serverapp.listen(5000, () => {
  console.log("server running on localhost:5000");
});

