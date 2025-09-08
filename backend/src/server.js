const app = require("./src/index");
const connect = require("./configs/db");

const PORT = process.env.PORT || 3001;

if (process.env.VERCEL) {
  // Running on Vercel → don't use app.listen
  module.exports = app;
} else {
  // Running locally
  const server = app.listen(PORT, async () => {
    try {
      const actualPort = server.address().port;
      console.log(`✅ Listening on http://localhost:${actualPort}`);
      await connect();
      console.log("✅ Database connected");
    } catch (error) {
      console.error("❌ DB connection error:", error.message);
    }
  });
}
