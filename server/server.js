import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Sarvhit API running on http://localhost:${PORT}`);
  console.log(`📄 Environment: ${process.env.NODE_ENV || "development"}`);
});
