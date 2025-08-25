import mysql, { PoolOptions } from "mysql2";

const access: PoolOptions = {
  host: "localhost",
  user: "root",
  password: "123456",
  database: "test",
  port: 8811,
};

const conn = mysql.createPool(access);

const batchSize = 173892;

const totalSize = 1738920;

let currentId = 1;
let values: any[] = [];

console.time("--------Insert Batch Time--------");
const insertBatch = async () => {
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const id = currentId;
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
  // without json
  const sql = "INSERT INTO test_without_json(id, name, age, address) VALUES ?";

  conn.query(sql, [values], (err, result: mysql.ResultSetHeader) => {
    if (err) {
      console.error("Error inserting batch:", err);
    } else {
      console.log(`Inserted ${result.affectedRows} rows`);
      values = [];
      insertBatch();
    }
  });

  // json
  //   const sql = "INSERT INTO test_json(content) VALUES ?";

  //   const jsonValues = values.map(([id, name, age, address]) => [
  //     JSON.stringify({ id, name, age, address }),
  //   ]);

  //   conn.query(sql, [jsonValues], (err, result: mysql.ResultSetHeader) => {
  //     if (err) {
  //       console.error("Error inserting batch:", err);
  //     } else {
  //       console.log(`Inserted ${result.affectedRows} rows`);
  //       values = [];
  //       insertBatch();
  //     }
  //   });
};

insertBatch().catch((err) => {
  console.error("Error in insertBatch:", err);
});
