const express = require("express");
const router = express.Router();

router.route("/get-metal-config").get((req, res) => {
  res.send("Hello World!!");
});

module.exports = router;
