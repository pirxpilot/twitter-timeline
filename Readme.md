
# twitter-timeline

Displays twitter timeline similarly to twitter widget but without iframe and with more flexible
styling options.

See [Furkot Help](http://help.furkot.com) to see in action.

## Installation

    $ npm install twitter-timeline

## API

To use twitter timeline specify the element in which it needs to be rendered and Twitter handle:

```javascript
var tt = require('twitter-timeline'),
el = document.getElementById('tt');
// render twitter for username furkot
tt('furkot').render(el);
```

By default 10 latest tweets are rendered. It can be changed using count method

```javascript
tt('furkot').count(15).render(el);
```

## Twitter API Server Proxy

Since version [Twitter API 1.1][twitter-api] requires [OAuth authentication][application-only-auth]
for all requests, including request for [public user timeout][user-timeline]. Because of the JSONP
no longer works, and I didn't have much luck with CORS either. The only reliable solution is setting
up server proxy for Twitter API requests.

You can use various methods of proxying Twitter API. If you happen to use NGINX check out [Dave Hall's blog][]
for details on how to retrive `bearer token` and configure the proxy.

## Styling

There is not any default styling included. Check out [example](https://github.com/pirxpilot/twitter-timeline/blob/master/example.html) for details.

The following classes are used:

- ```.timeline``` - list of all tweets
- ```.tweet``` - a single tweet
- ```.tweet .text``` - text of the tweet
- ```.tweet .photo``` - element containting ```anchor``` and ```img``` tags with the photo

## License

  MIT

[Dave Hall's blog]: http://blog.etianen.com/blog/2013/04/12/nginx-twitter-api-proxy/
[twitter-api]: https://dev.twitter.com/docs/api/1.1
[application-only-auth]: https://dev.twitter.com/docs/auth/application-only-auth
[user-timeline]: https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline