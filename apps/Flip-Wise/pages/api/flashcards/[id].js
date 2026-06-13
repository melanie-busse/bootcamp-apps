import Flashcard from "@/db/models/flashcard";
import dbConnect from "@/db/connect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions);
  await dbConnect();
  const { id } = request.query;

  if (request.method === "PUT") {
    try {
      if (!session) {
        return response.status(401).json({ status: "Not authorized" });
      }
      const flashcardData = request.body;
      const flashcardToUpdate = await Flashcard.findByIdAndUpdate(
        id,
        flashcardData,
        { new: true }
      );

      if (!flashcardToUpdate) {
        response.status(404).json({ status: "Flashcard not found" });
        return;
      }

      response.status(200).json(flashcardToUpdate);
      return;
    } catch (error) {
      response.status(500).json({ status: "error updating flashcard" });
      return;
    }
  }

  if (request.method === "DELETE") {
    try {
      if (!session) {
        return response.status(401).json({ status: "Not authorized" });
      }
      const deleted = await Flashcard.findByIdAndDelete(id);

      if (!deleted) {
        response.status(404).json({ status: "Flashcard not found" });
        return;
      }

      response.status(200).json("Flashcard deleted");
      return;
    } catch (error) {
      response.status(500).json({ status: "error deleting flashcard" });
      return;
    }
  }

  response.setHeader("Allow", ["PUT", "DELETE"]);
  response.status(405).end(`Method ${request.method} not allowed`);
}
