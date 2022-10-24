const needle = require("needle");

const getUserByUsernameController = async (req, res) => {
    const username = req.params.username;
    const token = process.env.BEARER_TOKEN;
    const endpointURL = "https://api.twitter.com/2/users/by?usernames=";
  
    async function getRequest() {
      const params = {
        usernames: username,
        "user.fields": "profile_image_url,public_metrics,description,verified",
      };
  
      const res = await needle("get", endpointURL, params, {
        headers: {
          "User-Agent": "v2UserLookupJS",
          authorization: `Bearer ${token}`,
        },
      });
  
      if (res.body) {
        return res.body;
      } else {
        throw new Error("Unsuccessful request");
      }
    }
  
    (async () => {
      try {
        const response = await getRequest();
  
        return res.status(201).json({
          response,
          message: "Successful search",
        });
      } catch (e) {
        console.log(e);
        process.exit(-1);
      }
      process.exit();
    })();
  };


  module.exports = {getUserByUsernameController}