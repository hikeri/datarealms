/* rss.js */
(function($) {
// URL of the RSS feed, can be changed if necessary
var feedUrl = 'http://feeds.feedburner.com/datarealms/';
// Using the rss2json service to convert RSS to JSON
// (rss2json.com has request limitations, for production you can use your own server proxy)
var apiUrl = 'https://api.rss2json.com/v1/api.json';

$.ajax({
    url: apiUrl,
    dataType: 'json',
    data: {
        rss_url: feedUrl
        // We do not pass the 'count' parameter because it requires an API key
    },
    success: function(response) {
        if (response.status === 'ok') {
            // Limit the number of entries on the client side (for example, 2 entries)
            var items = response.items.slice(0, 2);
            renderDevLog(items);
        } else {
            console.error('Error fetching RSS:', response.message);
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error('AJAX request error: ', textStatus, errorThrown);
    }
});

function renderDevLog(items) {
    // Find the container for the log list
    var $devlogText = $('#devlog_text');
    if (!$devlogText.length) {
        console.warn('Container #devlog_text not found.');
        return;
    }
    
    // Create a container for displaying the RSS log
    var $rssContainer = $('<div id="rssContent"></div>');
    // Maximum length for each item's description
    var maxLength = 200;
    
    $.each(items, function(index, item) {
        // Format the publication date, outputting it as a string (the format can be adjusted)
        var pubDate = new Date(item.pubDate).toUTCString();
        
        // Get the description text without HTML tags
        var description = $('<div>').html(item.description).text().trim();
        // If the description is too long, cut it off and add "[...]"
        if (description.length > maxLength) {
            description = description.substring(0, maxLength) + ' [...]';
        }
        
        // Construct the HTML block for an entry:
        // <p class="tagline"><a href="link">Title</a></p>
        // <p><sup>Date</sup><br>Description</p>
        var $entry = $('<div class="rssEntry"></div>');
        var $title = $('<p class="tagline"></p>');
        var $aTitle = $('<a></a>')
            .attr('href', item.link)
            .text(item.title);
        $title.append($aTitle);
        
        var $info = $('<p></p>');
        var $date = $('<sup></sup>').text(pubDate + " ");
        $info.append($date).append('<br>').append(description);
        
        $entry.append($title).append($info);
        $rssContainer.append($entry);
    });
    
    // Insert the block with the result in the desired location.
    // Here we insert the block before the element with class "rightalign" (the "MORE" link)
    $devlogText.find('span.rightalign').before($rssContainer);
}

})(jQuery);