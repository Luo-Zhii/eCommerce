import mysql, { PoolOptions } from "mysql2";

const access: PoolOptions = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "test",
  port: 8811,
};

const conn = mysql.createPool(access);

const batchSize = 100000;

const totalSize = 1000000;

let currentId = 1;
let values: any[] = [];

console.time("--------Insert Batch Time--------");
const insertBatch = async () => {
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name${currentId}`;
    const age = Math.floor(Math.random() * 100);
    const address = `address${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd("--------Insert Batch Time--------");
    conn.end((err) => {
      if (err) {
        console.error("Error ending connection:", err);
      } else {
        console.log("Connection ended successfully.");
      }
    });
    return;
  }

  const sql = "INSERT INTO test_table(id, name, age, address) VALUES ?";

  conn.query(sql, [values], (err, result: mysql.ResultSetHeader) => {
    if (err) {
      console.error("Error inserting batch:", err);
    } else {
      console.log(`Inserted ${result.affectedRows} rows`);
      values = [];
      insertBatch();
    }
  });
};

insertBatch().catch((err) => {
  console.error("Error in insertBatch:", err);
});
