const vault = require("node-vault")({
  apiVersion: "v1",
  namespace: "admin",
  endpoint:
    "https://vault-public-vault-7e7c58cd.a4170700.z1.hashicorp.cloud:8200",
});

const roleId = process.env.ROLE_ID
const secretId = process.env.SECRET_ID

const run = async () => {
  const result = await vault.approleLogin({
    role_id: roleId,
    secret_id: secretId,
  });

  vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

  const { data } = await vault.read("secret/data/webapp"); // Retrieve the secret stored in previous steps.
  return data.data
};

exports.vault = run;
