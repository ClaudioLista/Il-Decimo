exports.getList = (req, res, next) => {
    res.render("admin/listMatch", {
      path: "/listMatch",
      pageTitle: "List Match",
    });
  };