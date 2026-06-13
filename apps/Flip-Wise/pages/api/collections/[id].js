import dbConnect from "@/db/connect";
import Flashcard from "@/db/models/flashcard";
import Collection from "@/db/models/collection";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request, response) {
  const session = await getServerSession(request, response, authOptions)
  await dbConnect();
  const { id } = request.query;

  if (request.method === "PUT") {
    try {
      if (!session) {
        return response.status(401).json({ status: "Not authorized" });
      }
      const collectionCardData = request.body;
      const collectionToUpdate = await Collection.findByIdAndUpdate(
        id,
        collectionCardData,
        { new: true }
      );

      if (!collectionToUpdate) {
        response.status(404).json({ status: "Collection not found" });
        return;
      }

      response.status(200).json(collectionToUpdate);
      return;
    } catch (error) {
      response.status(500).json({ status: "error updating collection" });
      return;
    }
  }

  if (request.method === "DELETE") {
    try {
      const deleted = await Collection.findByIdAndDelete(id);

      if (!deleted) {
        response.status(404).json({ status: "Collection not found" });
        return;
      }
      await Flashcard.deleteMany({ collection: deleted.name });
      response.status(200).json("Collection deleted");
      return;
    } catch (error) {
      response.status(500).json({ status: "error deleting collection" });
      return;
    }
  }
  response.setHeader("Allow", ["PUT", "DELETE"]);
  response.status(405).end(`Method ${request.method} not allowed`);
}
