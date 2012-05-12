// switch feeds in <div id='feeds'>
$(document).ready(function() {
    $('#twitterFeed').show();
    $('#twitterFeedLink').addClass("activeFeedLink");

    $('.feedHeaderLink').click(function() {
        // note that using jQuery hide() and show() will cause
        // the browser to jump to the top of the page, even
        // if there is no animation
        $('#twitterFeed').css('display', 'none');
        $('#blogFeed').css('display', 'none');
        $('#webFeed').css('display', 'none');
        $('#feedHeader .activeFeedLink').removeClass('activeFeedLink');

        $('#' + $(this).attr('id')).addClass('activeFeedLink');
        $('#' + $(this).attr('id').replace('Link', '')).fadeIn('normal');
    });
});
