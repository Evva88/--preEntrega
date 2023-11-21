import chai from "chai";
import supertest from "supertest";
import { MongoClient } from 'mongodb';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("products test", () => {
  describe("testing products api", () => {
    it("should return products", async () => {
      let client;

      try {
        client = new MongoClient(process.env.MONGODB_CNX_STR, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        await client.connect();
        const database = client.db('tu_base_de_datos');
        const collection = database.collection('tu_coleccion');

      
        const realData = await collection.find().toArray();
        const response = await requester.get("/products");
        const responseProductTitles = response.body.map(product => product.title);

        expect(response.status).to.equal(200);
        expect(response.ok).to.equal(true);
        expect(responseProductTitles).to.deep.members(realData.map(product => product.title));
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
