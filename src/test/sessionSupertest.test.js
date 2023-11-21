import chai from "chai";
import supertest from "supertest";
import { MongoClient } from 'mongodb';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("sessions test", () => {
  describe("testing sessions api", () => {
    it("should return sessions", async () => {
      let client;

      try {
        client = new MongoClient(process.env.MONGODB_CNX_STR, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        await client.connect();
        const database = client.db('tu_base_de_datos');
        const collection = database.collection('sessions');

        
        const realData = await collection.find().toArray();
        const response = await requester.get("/sessions");
        const responseSessionIds = response.body.map(session => session._id);

        expect(response.status).to.equal(200);
        expect(response.ok).to.equal(true);
        expect(responseSessionIds).to.deep.members(realData.map(session => session._id));
      } catch (error) {
        console.error('Error during test:', error);
      } finally {
        if (client) { 
          await client.close();
        }
      }
    });
  });
});

