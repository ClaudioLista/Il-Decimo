
// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("user")
 .readOwn("matches")
 .updateOwn("matches")
 
ac.grant("admin")
 .extend("user")
 .readAny("profile")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();