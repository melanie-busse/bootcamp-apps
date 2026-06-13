import dbConnect from "../../../db/connect";
import Collection from "@/db/models/collection";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const collections = await Collection.find().sort({_id: -1});
      return response.status(200).json(collections);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
  
  if (request.method === "POST") {
    try {
      const collectionCardData = request.body;
      await Collection.create(collectionCardData);
      response.status(201).json({ status: "Collection created." });
      return;
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: error.message });
      return;
    }
  }
  
  else {
    return response.status(405).json({ message: "Method not allowed" });
  }
}
