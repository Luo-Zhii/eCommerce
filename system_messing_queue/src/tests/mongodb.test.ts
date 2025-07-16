import mongoose from "mongoose";
import "dotenv/config";

const testSchema = new mongoose.Schema({ name: String });
const test = mongoose.model("Test", testSchema);

describe("MongoDB Tests", () => {
  beforeAll(async () => {
    const dbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/testdb";
    await mongoose.connect(dbUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should connect to MongoDB successfully", async () => {
    const dbState = mongoose.connection.readyState;
    expect(dbState).toBe(1);
  });

  it("should save document to the database", async () => {
    const doc = new test({ name: "Test Document" });
    const savedDoc = await doc.save();
    expect(savedDoc.name).toBe("Test Document");
  });

  it("should retrieve document from the database", async () => {
    const foundDoc = await test.findOne({ name: "Test Document" });
    expect(foundDoc).toBeDefined();
    if (foundDoc) {
      expect(foundDoc.name).toBe("Test Document");
    }
  });
});
