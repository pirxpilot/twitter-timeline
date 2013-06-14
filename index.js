var moment = require('moment');
var render = require('json-to-dom');
var request = require('superagent');

function splice(str, start, end, replacement) {
  return [str.slice(0, start), replacement, str.slice(end)].join('');
}

function adjustText(tweet) {
  tweet.textAdjustment
  .sort(function(a, b) {
    // sort in reversed order
    return b.indices[0] - a.indices[0];
  })
  .forEach(function(adj) {
    tweet.text = splice(tweet.text, adj.indices[0], adj.indices[1], adj.text);
  });
  delete tweet.textAdjustment;
}

function createTextAdjustment(opt) {
    return {
      indices: opt.indices,
      text: '<a href="' + opt.href + '">' + opt.text + '</a>'
    };
}

function parseHashtags(entities, parsed) {
  if(!entities.hashtags) {
    return;
  }
  entities.hashtags.forEach(function(tag) {
    var ta = createTextAdjustment({
      href: 'https://twitter.com/search/%23' + tag.text,
      text: '#' + tag.text,
      indices: tag.indices
    });
    parsed.textAdjustment.push(ta);
  });
}

function parseUserMentions(entities, parsed) {
  if(!entities.user_mentions) {
    return;
  }
  entities.user_mentions.forEach(function(mention) {
    var ta = createTextAdjustment({
      href: 'https://twitter.com/intent/user?user_id=' + mention.id_str,
      text: '@' + mention.name,
      indices: mention.indices
    });
    parsed.textAdjustment.push(ta);
  });
}

function parseMedia(entities, parsed) {
  if(!entities.media) {
    return;
  }
  entities.media.forEach(function(media) {
    if(!parsed.photo && media.type !== 'photo') {
      return;
    }
    parsed.photo = {
      url: media.expanded_url,
      src: media.media_url_https
    };
    parsed.textAdjustment.push({
      indices: media.indices,
      text: ''
    });
  });
}

function parseUrls(entities, parsed) {
  if(!entities.urls) {
    return;
  }
  entities.urls.forEach(function(url) {
    var ta = createTextAdjustment({
      href: url.expanded_url,
      text: url.display_url,
      indices: url.indices
    });
    parsed.textAdjustment.push(ta);
  });
}

// interesting things about the tweet
// item.created_at
// item.text - tweet text
// item.entities - hashtags, urls, user_mentions, media (type: photo)
function parseTweet(tweet, username) {
  var parsed = {
    href: 'https://twitter.com/' + username + '/status/' + tweet.id_str,
    text: tweet.text,
    date: moment(tweet.created_at).fromNow(),
    textAdjustment: []
  };
  [parseMedia, parseHashtags, parseUserMentions, parseUrls].forEach(function(fn) {
    fn.call(null, tweet.entities, parsed);
  });
  adjustText(parsed);
  return parsed;
}

module.exports = function (username) {
  var self, my = {
    username: username,
    count: 10
  };

  function count(c) {
    my.count = c;
    return self;
  }

  function renderTweets(el) {
    var url = '/1.1/statuses/user_timeline.json';

    request(url)
    .query({
      screen_name: my.username,
      count: my.count,
      trim_user: 1,
      include_entities: 1
    })
    .end(function(res) {
      if (!res.ok) {
        return;
      }
      var tweets = res.body.map(function(tweet) {
        return parseTweet(tweet, my.username);
      });
      el.innerHTML = require('./template');
      render(el.querySelector('.timeline'), tweets);
    });
  }

  self = {
    count: count,
    render: renderTweets
  };

  return self;
};