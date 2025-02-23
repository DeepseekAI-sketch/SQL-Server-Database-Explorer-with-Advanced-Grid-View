import sql from "mssql";

let pool: sql.ConnectionPool | null = null;

export const config = {
  user: "TECHNO-DZ\\Brahim.ti",
  password: "11111",
  server: "C1612LP020",
  database: "ERP",
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

export async function connectDB() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("Connected to SQL Server");
    }
    return pool;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

export async function executeQuery(query: string) {
  try {
    const connection = await connectDB();
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("Query execution error:", err);
    throw err;
  }
}
