var wpHowTo_websiteUrl = window.location.href;
// Custom function to check if url starts with the right domain
function websiteStartsWith(str, word) {
    return str.lastIndexOf(word, 0) === 0;
}
var wpHowTo_mainDomain = websiteStartsWith(wpHowTo_websiteUrl, 'https://wphowto.tv');
var wpHowTo_pluginSubdomain = websiteStartsWith(wpHowTo_websiteUrl, 'https://plugin.wphowto.tv');

// Add Google search to website
function addCustomGoogleSearch(scriptSrc) {
    var searchScript = document.createElement('script');
    searchScript.src = scriptSrc;
    searchScript.type = 'text/javascript';
    var mainContent = document.getElementsByTagName('main')[0];
    mainContent.appendChild(searchScript);
    var searchIcon = document.createElement('a');
    searchIcon.classList.add('gcse-icon');
    searchIcon.title = 'Open/close search';
    mainContent.appendChild(searchIcon);
    var parentDiv = document.createElement('div');
    parentDiv.classList.add('gcse-parent');
    mainContent.appendChild(parentDiv);
    var searchDiv = document.createElement('div');
    searchDiv.classList.add('gcse-search');
    parentDiv.appendChild(searchDiv);
    if (window.self != window.top) {
        // Hide Google search if website in iframe
        searchIcon.style.display = 'none';
    }
    // Google search show/hide
    searchIcon.addEventListener('click', function() {
        this.classList.toggle('clicked');
        parentDiv.classList.toggle('clicked');
    });
}
addCustomGoogleSearch("https://cse.google.com/cse.js?cx=f276d6b0c7b698cb6");

// When page has loaded
document.addEventListener("DOMContentLoaded", function() {
    // Select elements needed for later manipulation
    var contentSection = document.querySelectorAll('.wp-block-post-content')['0'];
    var youtubePlayer = document.getElementById("youtube-player");
    var header = document.getElementsByTagName('header')[0];
    var footer = document.getElementsByTagName('footer')[0];
    var dateLinks = document.querySelectorAll('.wp-block-post-date a');
    var title = document.getElementsByTagName('h1')[0];
    var videosParent = document.querySelector('.youtube-videos');
    var youtubeItems = document.querySelectorAll('.youtube-item');
    var youtubeItemsArray = Array.prototype.slice.call(youtubeItems, 0);
    console.log(youtubeItemsArray);
    var allVideos = youtubeItemsArray.length;
    var links = document.querySelectorAll('.youtube-item .link');
    var linksArray = Array.prototype.slice.call(links, 0);
    var favouriteButtons = document.querySelectorAll('.youtube-item .buttons .favourite');
    var favouritesArray = Array.prototype.slice.call(favouriteButtons, 0);
    var relevanceFilter = document.createElement('button');
    var dateFilter = document.createElement('button');
    var backToTop = document.createElement('button');

    // Disable post date link (not useful)
    if (dateLinks) {
        var dateLinksArray = Array.prototype.slice.call(dateLinks, 0);
        dateLinksArray.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
        });
    }

    if (wpHowTo_mainDomain === true || wpHowTo_pluginSubdomain === true) {
        // Only if the website is in an iframe
        if (window.self != window.top) {
            // Hide header n footer
            header.classList.add('premium-only');
            footer.classList.add('premium-only');
            // Make youtube player hidden (youtube player api used within wp-how-to plugin)
            if (youtubePlayer) {
                youtubePlayer.style.display = 'none';
            }
            var titleHeight = 0;
            if (title) {
                titleHeight += title.offsetHeight;
            }
            relevanceFilter.classList.add('relevance-filter');
            relevanceFilter.classList.add('selected');
            relevanceFilter.innerText = 'Filter by relevance';
            if (contentSection) {
                contentSection.prepend(relevanceFilter);
            }
            dateFilter.classList.add('date-filter');
            dateFilter.innerText = 'Newest first';
            if (contentSection) {
                contentSection.prepend(dateFilter);
            }
            var initialYoutubeItemsArray = Array.prototype.slice.call(youtubeItems, 0);
            // Display videos by date
            function filterByDate() {
                dateFilter.classList.add('selected');
                relevanceFilter.classList.remove('selected');
                youtubeItems[0].classList.remove("first-played");
                videosParent.innerHTML = "";
                youtubeItemsArray.sort(function(a, b) {
                    var a = new Date(a.children[2].innerText.replace('Published at: ', ''));
                    var b = new Date(b.children[2].innerText.replace('Published at: ', ''));
                    if (a < b) return 1;
                    if (a > b) return -1;
                    return 0;
                }).forEach(function(item) {
                    videosParent.appendChild(item);
                });
            }
            dateFilter.addEventListener("click", filterByDate);
            // Display videos by relevance
            function filterByRelevance() {
                relevanceFilter.classList.add('selected');
                dateFilter.classList.remove('selected');
                youtubeItems[0].classList.remove("first-played");
                videosParent.innerHTML = "";
                initialYoutubeItemsArray.forEach(function(item) {
                    videosParent.appendChild(item);
                });
            }
            relevanceFilter.addEventListener("click", filterByRelevance);
            // Display 'back to top' button
            backToTop.classList.add('back-to-top');
            backToTop.innerText = 'Back to top';
            if (contentSection) {
                contentSection.appendChild(backToTop);
            }
            // Return to top of the page
            function scrollToTop() {
                window.scrollTo(0, 0);
            }
            backToTop.addEventListener("click", scrollToTop);
        } else {
            // When visiting the website directly (not iframe)
            for (var i = 0; i < 5; i++) {
                if (youtubeItemsArray) {
                    youtubeItemsArray[i].style.display = 'block';
                }
            }
            favouritesArray.forEach(function(button) {
                button.style.display = 'none';
            });
        }
    }

    // Set player src link
    var linkPrepend = 'https://www.youtube.com/embed/'
    var linkAppend = '?feature=oembed'
        // Adjust original youtube links to fit embed
    function adjustLinks(link) {
        var modifiedLink = '';
        var videoLinkReduction = 'https://www.youtube.com/watch?v=';
        var listLinkModification = 'https://www.youtube.com/playlist?list=';
        if (link.indexOf(videoLinkReduction) !== -1) {
            var reducedLink = link.replace(videoLinkReduction, '');
            modifiedLink = linkPrepend + reducedLink + linkAppend;
        } else if (link.indexOf(listLinkModification) !== -1) {
            modifiedLink = link.replace(listLinkModification, 'https://www.youtube.com/embed/videoseries?list=');
        }
        return modifiedLink;
    }

    // Change video played on link click
    var clickedEl;
    // Highlight video link last clicked
    function highlightVideo(e) {
        e.preventDefault();
        clickedEl = e.target;
        var videoLink = adjustLinks(clickedEl.href);
        var videoTitle = clickedEl.innerText;
        var divWithLink = clickedEl.parentNode.parentNode;
        var divId = divWithLink.id;
        var pageLink = window.location.href;
        if (youtubePlayer) {
            youtubePlayer.src = videoLink;
        }
        linksArray.forEach(function(link) {
            link.classList.toggle('playing');
        });
        linksArray.filter(function(link) {
            return link !== clickedEl;
        }).forEach(function(link) {
            link.classList.remove('playing');
        });
        // Only if the website is in an iframe
        if (window.self != window.top) {
            // Send to parent window
            var data = {};
            data['wpHowTo_videoLink'] = videoLink;
            data['wpHowTo_videoTitle'] = videoTitle;
            data['wpHowTo_divId'] = divId;
            data['wpHowTo_pageLink'] = pageLink;
            window.parent.postMessage(data, "*");
        } else { // Not embedded
            youtubePlayer.scrollIntoView();
        }
    }
    linksArray.forEach(function(link) {
        link.addEventListener('click', highlightVideo);
    });

    // Store video as favourite (only in iframe)
    var clickedFavButton;
    // Get video item data on fav button click
    function setFavourite(e) {
        clickedFavButton = e.target;
        var divWithLink = clickedFavButton.parentNode.parentNode;
        var link = divWithLink.querySelector('.link');
        var favLink = adjustLinks(link.href);
        var favTitle = link.innerText;
        var favDivId = divWithLink.id;
        var favPageLink = window.location.href;
        // Only if the website is in an iframe
        if (window.self != window.top) {
            // Send to parent window
            var data = {};
            data['wpHowTo_favLink'] = favLink;
            data['wpHowTo_favTitle'] = favTitle;
            data['wpHowTo_favDivId'] = favDivId;
            data['wpHowTo_favPageLink'] = favPageLink;
            window.parent.postMessage(data, "*");
        }
        if (clickedFavButton.classList.contains('selected')) {
            clickedFavButton.classList.remove('selected');
            clickedFavButton.innerText = 'Add to favourites';
        } else {
            clickedFavButton.classList.add('selected');
            clickedFavButton.innerText = 'Already in favourites!';
        }
    }
    favouritesArray.forEach(function(button) {
        button.addEventListener('click', setFavourite);
    });

    // Detect data sent back to iframed website
    window.addEventListener("message", function(event) {
        // Detect license (premium or not)
        if (event.data.wpHowTo_freemiusLicense) {
            var premiumLicense = event.data.wpHowTo_freemiusLicense;
            // Only if the website is in an iframe
            if (window.self != window.top) {
                if (premiumLicense === 'true') {
                    for (var i = 0; i < allVideos; i++) {
                        // Display all items
                        if (youtubeItemsArray) {
                            youtubeItemsArray[i].style.display = 'block';
                        }
                    }
                } else { // If it's free version of plugin
                    if (youtubeItemsArray) {
                        // Display only 1 video per item
                        youtubeItemsArray[0].style.display = 'block';
                    }
                    // Hide filter buttons
                    relevanceFilter.style.display = 'none';
                    dateFilter.style.display = 'none';
                    // Hide 'add to favourites' buttons
                    favouritesArray.forEach(function(button) {
                        button.style.display = 'none';
                    });
                    // Hide 'Back to top' button
                    backToTop.style.display = 'none';
                    // Add 'Buy Premium' link to the bottom of the page
                    if (contentSection) {
                        var buyPremium = document.createElement('a');
                        buyPremium.classList.add('buy-premium');
                        buyPremium.innerText = 'Buy Premium License';
                        buyPremium.href = 'https://plugin.wphowto.tv/buy-premium/';
                        buyPremium.setAttribute('target', '_blank');
                        contentSection.appendChild(buyPremium);
                    }
                }
            }
        }
        // Last watched video div scroll into view
        if (event.data.wpHowTo_selectedVideoDiv) {
            var divId = event.data.wpHowTo_selectedVideoDiv;
            var selectedDiv = document.getElementById(divId);
            if (selectedDiv) {
                var selectedLink = selectedDiv.children['0'].children['0'];
                selectedLink.classList.add('playing');
                setTimeout(function() {
                    document.documentElement.scrollTop = selectedDiv.offsetTop;
                }, 2000);
            }
        }
        // Stored favourite videos
        if (event.data.wpHowTo_favVideoIds) {
            var favVideos = event.data.wpHowTo_favVideoIds;
            favVideos.forEach(function(videoId) {
                var favVideo = document.getElementById(videoId);
                if (favVideo) {
                    var favButton = favVideo.children['1'].children['0'];
                    favButton.classList.add('selected');
                    favButton.innerText = 'Already in favourites!';
                }
            });
        }
        // Open fav/history link on select from library tab
        if (event.data.wpHowTo_selectedLibraryItem) {
            var divId = event.data.wpHowTo_selectedLibraryItem;
            var selectedDiv = document.getElementById(divId);
            if (selectedDiv) {
                var selectedLink = selectedDiv.children['0'].children['0'];
                selectedLink.classList.add('playing');
                linksArray.filter(function(link) {
                    return link !== selectedLink;
                }).forEach(function(link) {
                    link.classList.remove('playing');
                });
                setTimeout(function() {
                    document.documentElement.scrollTop = selectedDiv.offsetTop;
                }, 2100);
            }
        }
    });
});