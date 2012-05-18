// Uses Twitter REST API
// Documentation at http://dev.twitter.com/

$(function() {
    
   	$.getJSON('https://twitter.com/status/user_timeline/zhihaojia.json?count=12&exclude_replies=true&callback=?', function(data) {
        // receives count number of tweets before applying exclude_replies argument
        // want to keep track of real count so we don't display too many
        var indexLimit = 7;
        var html = '';
   	    $.each(data, function(index, item) {
            if (index > indexLimit) { return; }
            html += '<li>' + item.text.linkify()
            html += ' <span class="faded">(<a href="https://twitter.com/ZhihaoJia/statuses/' + item.id_str  + '" target="_blank">' + relative_time(item.created_at) + ')</a></span></li>';
   	    });

        // doesn't seem like I can catch error using jQuery and JSONP (JSON works, but isn't cross-site)
        // use html string to guess whether request successful
        if (html == '') {
            // twitter uses hourly rate-limiting, which may cause HTTP 400 response codes if limit reached
            // want to check if rate limit is reached
            // documentation at http://dev.twitter.com/docs/rate-limiting and http://dev.twitter.com/docs/rate-limiting/faq
            $.getJSON('https://api.twitter.com/account/rate_limit_status.json?callback=?', function(data) {
                if (data.remaining_hits <= 0) {
                    $('#twitterFeed').append('<p class="msg">Maximum number of requests reached.</p>');
                }
                else {
                    $('#twitterFeed').append('<p class="msg">Unable to display feed.</p>');
                }
            });
        }
        else {
   	        $('#twitterFeed').append('<ul>' + html + '</ul>');
        }
   	});
    
   	String.prototype.linkify = function() {
        var linkified = this;
        // links urls
   	    linkified = linkified.replace(/(http[s]?:\/\/[\S]+)/, '<a href="$1" target="_blank">$1</a>');
        // link mentions
        linkified = linkified.replace(/@([A-Za-z0-9_]+)/, '<a href="http://twitter.com/$1" target="_blank">@$1</a>');
        // link hashtags
        linkified = linkified.replace(/#([A-Za-z0-9_]+)/, '<a href="http://twitter.com/search/#$1" target="_blank">#$1</a>');
        return linkified;
   	};

    // Original code by Chris Coyier
   	function relative_time(time_value) {
        var values = time_value.split(" ");
        time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
        var parsed_date = Date.parse(time_value);
        var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
        var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
        delta = delta + (relative_to.getTimezoneOffset() * 60);
          
   	    var r = '';
   	    if (delta < 60) {
   	        r = 'a minute ago';
   	    } else if(delta < 120) {
   	        r = 'couple of minutes ago';
   	    } else if(delta < (45*60)) {
   		    r = (parseInt(delta / 60)).toString() + ' minutes ago';
   	    } else if(delta < (90*60)) {
   	        r = 'an hour ago';
   	    } else if(delta < (24*60*60)) {
   	        r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
   	    } else if(delta < (48*60*60)) {
   	        r = '1 day ago';
   	    } else {
   	        r = (parseInt(delta / 86400)).toString() + ' days ago';
   	    }
   	  
   	    return r;
   	}
   	
});

