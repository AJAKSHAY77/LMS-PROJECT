import DBconnection from "./Config/DBconnection.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await DBconnection();
  console.log(`server is running at http://localhost:${PORT}`);
});
