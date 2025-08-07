// Connect DB and start server logic............
import ConnectDB from "./src/config/db.config.js";
import { server } from "./src/utils/socket.js";

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/api/v1/auth`);
  ConnectDB();
});
