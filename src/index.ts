import { Pinecone } from "@pinecone-database/pinecone";
import fs from "fs";

const pinecone = new Pinecone({
  apiKey:
    "pcsk_53spSK_GgTEf2Sy78oiDUtoBY6rUBvXpW2y1NLdezTdxHGu1xqejxc7knCLWZoNqEHzZ5H",
});
const sampleData = {
  cat: [
    0.12, 0.34, 0.11, 0.56, 0.43, 0.89, 0.21, 0.33, 0.74, 0.6, 0.13, 0.25, 0.45,
    0.61, 0.31, 0.72, 0.17, 0.59, 0.4, 0.62, 0.22, 0.44, 0.78, 0.81, 0.3, 0.16,
    0.67, 0.5, 0.39, 0.95, 0.24, 0.73, 0.19, 0.53, 0.29, 0.66, 0.83, 0.46, 0.32,
    0.54, 0.12, 0.9, 0.37, 0.85, 0.28, 0.42, 0.77, 0.31, 0.36, 0.18,
  ],
  dog: [
    0.2, 0.31, 0.18, 0.58, 0.47, 0.75, 0.26, 0.3, 0.69, 0.64, 0.19, 0.28, 0.4,
    0.67, 0.33, 0.7, 0.13, 0.55, 0.42, 0.59, 0.27, 0.49, 0.73, 0.77, 0.34, 0.2,
    0.62, 0.45, 0.36, 0.88, 0.21, 0.68, 0.15, 0.5, 0.31, 0.6, 0.79, 0.41, 0.29,
    0.52, 0.16, 0.84, 0.39, 0.81, 0.24, 0.38, 0.7, 0.27, 0.33, 0.22,
  ],
  king: [
    0.91, 0.86, 0.79, 0.95, 0.72, 0.88, 0.82, 0.9, 0.85, 0.89, 0.77, 0.8, 0.84,
    0.87, 0.93, 0.96, 0.81, 0.94, 0.75, 0.78, 0.7, 0.74, 0.97, 0.98, 0.76, 0.69,
    0.83, 0.91, 0.71, 0.99, 0.73, 0.92, 0.68, 0.93, 0.67, 0.89, 0.86, 0.88,
    0.65, 0.9, 0.64, 0.95, 0.66, 0.87, 0.63, 0.85, 0.62, 0.84, 0.61, 0.83,
  ],
  queen: [
    0.85, 0.9, 0.76, 0.92, 0.79, 0.91, 0.81, 0.88, 0.84, 0.87, 0.75, 0.83, 0.86,
    0.89, 0.94, 0.97, 0.8, 0.93, 0.73, 0.77, 0.69, 0.72, 0.96, 0.99, 0.74, 0.66,
    0.82, 0.9, 0.7, 0.98, 0.71, 0.91, 0.65, 0.94, 0.64, 0.87, 0.83, 0.86, 0.63,
    0.89, 0.6, 0.93, 0.67, 0.88, 0.62, 0.84, 0.61, 0.85, 0.59, 0.82,
  ],
};
const vector = Object.entries(sampleData).map(([id, values]) => ({
  id,
  values,
}));

async function main() {
  try {
    await pinecone
      .createIndex({
        name: "vector-index",
        dimension: 50,
        metric: "cosine",
        spec: {
          serverless: { cloud: "aws", region: "us-east-1" },
          pod: {
            pods: 1,
            podType: "s1.x1",
            environment: "serverless",
          },
        },
      })
      .catch((error) => {
        // console.log("Index already exists, skipping creation.", error);
      });

    const index = pinecone.Index("vector-index");

    await index.upsert(vector);

    const query = sampleData.king;

    const response = await index.query({
      vector: query,
      topK: 2,
      includeValues: false,
    });

    console.log('Similar words to "cat":', response);
  } catch (error) {
    console.error("Error creating index or inserting data:", error);
    throw error;
  }
}

main()
  .then(() => console.log("Index created and data inserted successfully."))
  .catch((error) => {
    console.error("Error creating index or inserting data:", error);
  });
