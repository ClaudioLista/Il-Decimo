const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("user")
 .readOwn("profile")
 .updateOwn("profile")
 .readOwn("matches")
 .updateOwn("matches")
 .deleteOwn("matches")
 
ac.grant("admin")
 .extend("user")
 .readAny("profile")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();