$(function() {
    $('.disabled').click(function(event) {
        event.preventDefault();
    });

    $('#twitterFeed').show();
    $('#twitterFeedLink').addClass("activeFeedLink");

    $('.feedHeaderLink').click(function() {
        $('.feed').css('display', 'none');
        $('#feedHeader .activeFeedLink').removeClass('activeFeedLink');

        $('#' + this.id).addClass('activeFeedLink');
        $('#' + this.id.replace('Link', '')).fadeIn('normal');
    });
});
