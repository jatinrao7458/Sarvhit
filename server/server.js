import app from "./src/app.js";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Sarvhit API running on http://localhost:${PORT}`);
    console.log(`📄 Environment: ${process.env.NODE_ENV || "development"}`);
  });
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});
