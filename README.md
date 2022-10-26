# Back end service for Twitter App 

# Introduction
Recently I took an avid interest on APIs and on becoming familiar to its documentation. Following that direction, I chose Twitter API, explored its endpoint and thought about building an app with them.

## Overview
The API has 3 controllers, each one related to an endpoint:  

1) getUserByUsernameController: using user's username (contained in request's params), this endpoint returns user ID in the response.

2) getUserStats: using userId (contained in request's params), this endpoint retrieves user data from Twitter API. User data is filtered with .reduce() array method, to return user's total tweets, likes and retweets in the response.

3) getTopTenRetweetedTweets: using userId (contained in request's params), this endpoint retrieves user data from Twitter API. User data is filtered with .sort() and .slice() array methods, to return user's top ten retweeted and liked tweets in the response.

![app flow](https://cms-assets.tutsplus.com/cdn-cgi/image/width=562/uploads/users/317/posts/22192/image/streaming-intro-1_1.png)


## Framework
- Express

## Run this sample!
- Run npm install
- Clone this repository
- Run nodemon app.js

The app was deployed using heroku and can be found in the following link:  
https://mlabato-twitter-app.herokuapp.com/

