// Uses Google Feed API
// Documentation at https://developers.google.com/feed/

// feeds to add to page
var pageFeeds = [{type:"blog", containerID:"blogFeed", count: 0,
                 url:"http://news.ycombinator.com/rss"}, // temp feed
                 {type:"web", containerID:"webFeed", count: 10,
                 url:"http://www.google.com/reader/public/atom/user%2F09866597367019203653%2Fbundle%2FZhihaoJiaFeed"}]
var containerQueue = []; // bad style, should fix this

// load feed API
google.load('feeds', '1');

// register handler function to process feed data on page load
google.setOnLoadCallback(OnLoad);

function OnLoad() {
    // retrieve all the feeds to display
    for (var i = 0; i < pageFeeds.length; i++) {
        // create feed instance, set target feed, configure settings
        var feed = new google.feeds.Feed(pageFeeds[i].url);
        feed.setResultFormat(google.feeds.Feed.JSON_FORMAT);
        feed.setNumEntries(pageFeeds[i].count);
        containerQueue.push(pageFeeds[i].containerID);

        // download feed, requires callback function
        feed.load(feedLoaded);
    }
}

// asynchronous callback for when a feed is loaded.
function feedLoaded(result) {
    // grab the container for the results
    var containerID = containerQueue.shift();
    var container = document.getElementById(containerID);

    if (!result.error) {
        // do I really need this part?
		if (result.feed.entries.length === 0) {
            $('<p/>', {
                'class': 'msg',
                html: 'Unable to display feed.'
            }).appendTo(container);
			return;
        }

        container.innerHTML = '';
        var items = [];

        // loop through feeds, extract and format desired info, put on page
        for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            items.push('<div class="feed_item"><dt>' + entry.title + '</dt>' + '<dd><em>' + entry.contentSnippet + '</em> <span class="faded">(<a href="' + entry.link + '" target="_blank">read more</a>)</span></dd></div>');
        }
        $('<dl/>', {
            html: items.join('')
        }).appendTo(container);
        
        // toggle feed snippet visibility on feed item click
        $('#' + containerID + ' .feed_item').click(function() {
            $(this).find('dd').slideToggle('normal');
        });
    }
    else {
        $('<p/>', {
            'class': 'msg',
            html: 'Unable to display feed.'
        }).appendTo(container);
    }
}
