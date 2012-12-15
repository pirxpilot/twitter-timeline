
# twitter-timeline

Displays twitter timeline similarly to twitter widget but without iframe and with more flexible
styling options.

See [Furkot Help](http://help.furkot.com) to see in action.

## Installation

    $ component install code42day/twitter-timeline

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

## Styling

There is not any default styling included. Check out [example](/code42day/twitter-timeline/blob/master/example.html) for details.

The following classes are used:

- ```.timeline``` - list of all tweets
- ```.tweet``` - a single tweet
- ```.tweet .text``` - text of the tweet
- ```.tweet .photo``` - element containting ```anchor``` and ```img``` tags with the photo

## License

  MIT
