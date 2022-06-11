document.addEventListener('DOMContentLoaded', function() {
    // Only if the website is in accessed directly (not in iframe)
    if (window.self === window.top) {
        cookieconsent.run({ "notice_banner_type": "headline", "consent_type": "simple", "palette": "dark", "language": "en", "page_load_consent_levels": ["strictly-necessary"], "notice_banner_reject_button_hide": false, "preferences_center_close_button_hide": false, "page_refresh_confirmation_buttons": false, "website_privacy_policy_url": "https://plugin.wphowto.tv/privacy-policy/" });
    }
});