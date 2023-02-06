const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
    ac.grant("user")
    .readOwn("profile",['*','!_id','!role'])
    .updateOwn("profile",['*','!_id','!role'])
    .readAny("matches",['*','!_id','price'])
    .updateOwn("matches",['*','!_id','hostUserId'])
    .deleteOwn("matches",['*','!_id','hostUserId'])
    .updateOwn("votes")
    
    ac.grant("admin")
    .extend("user")
    .createAny("profile")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .createAny("matches")
    .readAny("matches")
    .updateAny("mathces")
    .deleteAny("matches")
    .updateAny("role")
 
    return ac;
})();