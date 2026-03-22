const { io } = require("socket.io-client");

const tokens = [process.env.TOKEN_A, process.env.TOKEN_B];
const names = ["User_Alpha", "User_Beta"];
let finished = 0;

tokens.forEach((token, index) => {
  const socket = io("https://localhost/chat", {
    path: "/api/chat/socket.io",
    auth: { token },
    rejectUnauthorized: false
  });

  socket.on("connect", () => {
    console.log(`✅ ${names[index]} Connected`);
    setTimeout(() => {
      socket.emit("send_msg", { content: `Hello from ${names[index]}!` });
    }, 500 * index); // Slight delay so messages have different timestamps
  });

  socket.on("receive_msg", (data) => {
    console.log(`📩 ${names[index]} received: [${data.senderName}]: ${data.content}`);
    finished++;
    if (finished === 4) { // Both users received both messages (2x2)
      console.log("✨ All messages exchanged successfully.");
      process.exit(0);
    }
  });
});

setTimeout(() => process.exit(1), 10000); // Fail-safe timeout