const vault = require("node-vault")({
  apiVersion: "v1",
  namespace: "admin",
  endpoint:
    "https://vault-public-vault-7e7c58cd.a4170700.z1.hashicorp.cloud:8200",
});

// const roleId = "bdf655c7-87a8-d3da-f958-0925c54aec0a";
// const secretId = "272187bd-fd7b-66fb-ec3a-8dafe86fcdf5";
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
