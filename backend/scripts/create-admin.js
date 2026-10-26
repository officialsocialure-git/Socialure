require("dotenv").config();
const readline = require("readline");
const mongoose = require("mongoose");
const { createInitialAdmin } = require("../src/services/admin-bootstrap");

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function askHidden(question) {
  rl.close();
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
      reject(new Error("Run this script in an interactive terminal so the admin password can be entered safely."));
      return;
    }
    const stdin = process.stdin;
    let value = "";
    process.stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    const onData = chunk => {
      const key = chunk.toString("utf8");
      if (key === "\r" || key === "\n") {
        stdin.removeListener("data", onData);
        stdin.setRawMode(false);
        process.stdout.write("\n");
        resolve(value);
      } else if (key === "\u0003") {
        stdin.removeListener("data", onData);
        stdin.setRawMode(false);
        process.stdout.write("\nCancelled.\n");
        reject(new Error("Cancelled."));
      } else if (key === "\u007f" || key === "\b") {
        value = value.slice(0, -1);
      } else if (key >= " " && key !== "\u001b") {
        value += key;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === "PASTE_YOUR_ATLAS_CONNECTION_STRING_HERE") {
    throw new Error("Configure MONGODB_URI in backend/.env before creating the admin.");
  }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const name = await ask("Admin name: ");
  const email = await ask("Admin email: ");
  const password = await askHidden("Admin password (minimum 12 characters; input hidden): ");
  const admin = await createInitialAdmin({ name, email, password });
  console.log(`Created admin account for ${admin.email}. Password was hashed before saving.`);
}

main()
  .catch(error => {
    console.error("Could not create admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  });
