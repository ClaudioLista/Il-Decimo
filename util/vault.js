const vault = require("node-vault")({
  apiVersion: "v1",
  namespace: "admin",
  endpoint: process.env.VAULT_ENDPOINT
});

const roleId = process.env.ROLE_ID
const secretId = process.env.SECRET_ID

const run = async () => {
 
  const data = {
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_SECRET:process.env.SESSION_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  MONGODB_URI_LOGS: process.env.MONGODB_URI_LOGS

  }

  return data
};

exports.vault = run;
