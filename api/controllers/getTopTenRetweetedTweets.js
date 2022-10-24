const needle = require("needle");

const getTopTenRetweetedTweets = (req, res) => {
  const userId = req.params.userid;
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;

  const bearerToken = process.env.BEARER_TOKEN;

  const getUserTweets = async () => {
    let userTweets = [];

    let params = {
      max_results: 100,
      "tweet.fields": "public_metrics,created_at,entities",
      exclude: "retweets,replies",
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

    const filteredData = userTweets.map((twit) => {
      return {
        retweet: twit.public_metrics.retweet_count,
        // url: twit.entities.urls[0].expanded_url,
        favs: twit.public_metrics.like_count,
        text: twit.text,
        created_at: twit.created_at,
        attachments: twit.attachments,
      };
    });

    const compareRetweets = (a, b) => {
      return b.retweet - a.retweet;
    };
    const orderedRetweets = filteredData.sort(compareRetweets);
    const topTenRetweeted = orderedRetweets.slice(0, 10);

    const compareFavs = (a, b) => {
      return b.favs - a.favs;
    };

    const orderedFavs = filteredData.sort(compareFavs);

    const topTenFaved = orderedFavs.slice(0, 10);

    return res.status(201).json({
      
      topTenRetweeted,
      topTenFaved,
      message: `Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`,
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

module.exports = { getTopTenRetweetedTweets };
