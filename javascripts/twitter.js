// Original code by Chris Coyier
// Uses Twitter REST API
// Documentation at https://dev.twitter.com/

$(function() {
    
   	$.getJSON('https://twitter.com/status/user_timeline/zhihaojia.json?count=12&exclude_replies=true&callback=?', function(data) {
        // receives count number of tweets before applying exclude_replies argument
        // want to keep track of real count so we don't display too many
        var indexLimit = 5;
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
            // documentation at https://dev.twitter.com/docs/rate-limiting and https://dev.twitter.com/docs/rate-limiting/faq
            $.getJSON('https://api.twitter.com/account/rate_limit_status.json?callback=?', function(data) {
                if (data.remaining_hits <= 0) {
                    $('#twitterFeed').append('<p class="msg">Max number of requests reached.</p>');
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
   	
   	String.prototype.linkify = function() {
        // link mentions
        var linkified = this.replace(/@([A-Za-z0-9_]+)/, '<a href="https://twitter.com/$1" target="_blank">@$1</a>');
        // links urls
   	    linkified = linkified.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(m) {
   	        return m.link(m);
   	    });
        return linkified;
   	};

});

