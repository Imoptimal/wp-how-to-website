# wp-how-to-website

# Instructions:
- Install wordpress locally, using Local by Flywheel - PHP version must be > 7.4 (Simply Static plugin requires it).
- Adjust settings in admin dashboard:
  - General - set tagline to 'WordPress Tutorials'
  - Discussion - check off "Allow people to submit comments on new posts"
  - Permalinks - rename category to "tutorials"; set custom structure to "/%category%/%postname%/"
- Add categories:
  - Plugin Tutorials (slug: wordpress-plugin)
  - How to Tutorials (slug: wordpress-topic)
- Download the latest official wordpress theme (parent) and activate the customized child theme:
  - Open full site editor and edit header:
    - Add site logo to header (resize uploaded logo to width of 150px) - to the left position
    - Add navigation ('How to Tutorials' and 'Plugin Tutorials' category page) - to the right position
  - Edit footer:
    - Add columns block ('WP HOW TO - WordPress plugin' - absolute path to plugin. subdomain, 'Privacy Policy' - absolute path to plugin. subdomain policy page - open all in the new tab) - to the left position
    - Add text Created with 'Simply Static & GitHub Pages' (with their respective homepage links) - to the right position
- Install plugins:
  - Simply Static
  - RPD (my own)
- Run RPD three steps:
  - <b>NOTE:</b> After the second step, check json file folders for small files (aprox under 1 kb), and delete those with empty 'youtubeVideos' array, so the third step can run smoothly.
  - In the third step, choose to store all video per item (premium), and do plugin tutorials first (how to items will remain as the latest posts).
- Convert webiste to static using Simply static plugin (Set relative paths - avoiding issue with website resources).
- Upload here.
- Create 404.html file here on GitHub website, and populate it with needed elements. <br>
<b>NOTE! When updating repository, delete all static files except 404.html, CNAME, LICENSE and README.md, and the upload all of the static files generated by Simply Static!</b>

