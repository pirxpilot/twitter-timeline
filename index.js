var el = require('el');
var tweet2html = require('tweet-html');
var request = require('fetchagent');

module.exports = function (username) {
  var self, my = {
    username: username,
    exclude_replies: 0,
    include_rts: 1,
    count: 10
  };

  function count(c) {
    my.count = c;
    return self;
  }

  function replies(r) {
    my.exclude_replies = r ? 0 : 1; // note the reverse logic
    return self;
  }

  function retweets(r) {
    my.include_retweets = r ? 1 : 0;
    return self;
  }

  function renderTweets(container) {
    var count = my.count,
      url = '/1.1/statuses/user_timeline.json';

    if (my.include_rts !== 1 || my.exclude_replies !== 0) {
      count *= 3; // ask for more so that we can still get valid count
    }

    request
    .get(url)
    .query({
      screen_name: my.username,
      count: count,
      exclude_replies: my.exclude_replies,
      include_rts: my.include_rts,
      trim_user: 1,
      include_entities: 1,
      tweet_mode: 'extended'
    })
    .json()
    .then(function(body) {
      var tweets = body.slice(0, my.count).map(function(tweet) {
        return el('li.tweet', tweet2html(tweet, my.username));
      });
      container.innerHTML = el('ul.timeline', tweets.join(''));
    });
  }

  self = {
    count: count,
    replies: replies,
    retweets: retweets,
    render: renderTweets
  };

  return self;
};
