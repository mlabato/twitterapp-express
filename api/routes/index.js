let express = require("express");
let router = express.Router();


const { index  } = require("../controllers/index");

const {getUserByUsernameController} = require("../controllers/getUserByUsernameController")
const {getTopTenRetweetedTweets} = require("../controllers/getTopTenRetweetedTweets")
const {getUserStats} = require("../controllers/getUserStats")


const cors = require("cors");

router.use(cors());

router.get("/", index);
router.get("/get-user-by-username/:username", getUserByUsernameController);
router.get("/top-ten-rt/:userid", getTopTenRetweetedTweets);
router.get("/user-stats/:userid", getUserStats)




module.exports = router;
