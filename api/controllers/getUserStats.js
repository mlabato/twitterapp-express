const needle = require("needle");

const getUserStats = (req, res) => {
  const userId = req.params.userid;
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;

  const bearerToken = process.env.BEARER_TOKEN;

  const getUserTweets = async () => {
    let userTweets = [];

    let params = {
      max_results: 100,
      "tweet.fields": "public_metrics,created_at",
      exclude: "retweets",
      expansions: "author_id",
    };

    const options = {
      headers: {
        "User-Agent": "v2UserTweetsJS",
        authorization: `Bearer ${bearerToken}`,
      },
    };

    let hasNextPage = true;
    let nextToken = null;
    let userName;
    console.log("Retrieving Tweets...");

    while (hasNextPage) {
      let resp = await getPage(params, options, nextToken);
      if (
        resp &&
        resp.meta &&
        resp.meta.result_count &&
        resp.meta.result_count > 0
      ) {
        userName = resp.includes.users[0].username;
        if (resp.data) {
          userTweets.push.apply(userTweets, resp.data);
        }
        if (resp.meta.next_token) {
          nextToken = resp.meta.next_token;
        } else {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }

    const totalRetweets = userTweets.reduce((acc, cur)=>{
        return acc + cur.public_metrics.retweet_count
      },0)

    const totalFavs = userTweets.reduce((acc, cur)=>{
        return acc + cur.public_metrics.like_count
      },0)

    return res.status(201).json({
      totalRetweets: totalRetweets,
      totalFavs: totalFavs,
      totalTweets: userTweets.length,
      message: `Twitter stats from ${userName} (user ID ${userId})!`,
    });
  };

  const getPage = async (params, options, nextToken) => {
    if (nextToken) {
      params.pagination_token = nextToken;
    }

    try {
      const resp = await needle("get", url, params, options);

      if (resp.statusCode != 200) {
        console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
        return;
      }
      return resp.body;
    } catch (err) {
      throw new Error(`Request failed: ${err}`);
    }
  };

  getUserTweets();
};

module.exports = { getUserStats };
