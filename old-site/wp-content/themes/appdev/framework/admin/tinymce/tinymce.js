function init() {
    tinyMCEPopup.resizeToInnerSize();
}

function getshortcodeText(selectedShortcode) {

    var shortcodeText = null;

    /*--------------- 	Content Shortcodes   ------------------- */

    if (selectedShortcode == "segment") {
        shortcodeText = '[segment id="" class="" style="" background_image="http://example.com/x.png" background_pattern="http://example.com/y.png" background_color="#333" fixed_background="true"]<p>Replace with your segment content here</p>[/segment]';
        return shortcodeText;
    }

    if (selectedShortcode == 'heading2') {
        shortcodeText = '[heading2 heading_text="My Heading" pitch_text="Additional description" separator="false"]Additional content[/heading2]';
        return shortcodeText;
    }

    /*--------------- 	Home Page Shortcodes   ------------------- */

    if (selectedShortcode == 'service_box1') {
        shortcodeText = '[service_box1 title="My Service" link_url="http://example.com" image_url="http://example.com/x.png" hover_image_url="http://example.com/y.png"]<p>Replace with your service description here</p>[/service_box1]';
        return shortcodeText;
    }

    if (selectedShortcode == 'service_box2') {
        shortcodeText = '[service_box2 title="My Services" link_url="http://example.com" image_url="http://example.com/x.png" hover_image_url="http://example.com/y.png"]<p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat</p>[/service_box2]';
        return shortcodeText;
    }

    if (selectedShortcode == 'project_showcase') {
        shortcodeText = '[project_showcase portfolio_link="http://example.com/portfolio-page/" blog_link="http://example.com/blog"]<p>Replace with your service description here</p>[/project_showcase]';
        return shortcodeText;

    }

    /*--------------- 	Column Shortcodes   ------------------- */

    if (selectedShortcode == 'two_columns_template') {
        shortcodeText = "[one_half]<br />Replace with your content<br />[/one_half]<br /><br />[one_half_last]<br />Replace with your content<br />[/one_half_last]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'three_columns_template') {
        shortcodeText = "[one_third]<br />Replace with your content<br />[/one_third]<br /><br />[one_third]<br />Replace with your content<br />[/one_third]<br /><br />[one_third_last]<br />Replace with your content<br />[/one_third_last]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'four_columns_template') {
        shortcodeText = "[one_fourth]<br />Replace with your content<br />[/one_fourth]<br /><br />[one_fourth]<br />Replace with your content<br />[/one_fourth]<br /><br />[one_fourth]<br />Replace with your content<br />[/one_fourth]<br /><br />[one_fourth_last]<br />Replace with your content<br />[/one_fourth_last]<br />";
        return shortcodeText;
    }

    /*--------------- 	Button Shortcodes   ------------------- */
    if (selectedShortcode == 'grey_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"grey\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'black_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"black\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'white_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"white\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'orange_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"orange\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'red_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"red\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'blue_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"blue\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'purple_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"purple\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'green_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"green\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'pink_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"pink\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'light_blue_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"light_blue\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }
    if (selectedShortcode == 'yellow_button') {
        shortcodeText = "[button size=\"small,medium,large\" type=\"rounded\" color=\"yellow\" href=\"http://www.\" ]Replace with your content[/button]<br />";
        return shortcodeText;
    }

    /* ----------- Lists ---------------- */

    if (selectedShortcode == 'list') {
        shortcodeText = "[list type=\"list1,list2,....list13\"]<li>Item 1...</li><li>Item 2...</li><li>Item 3...</li>[/list]<br />";
        return shortcodeText;
    }

    /* -------------- Divider Shortcodes ------------------ */

    messageShortcodes = new Array("divider", "divider_space", "divider_line", "divider_top", "divider_fancy", "clear");
    if (messageShortcodes.indexOf(selectedShortcode) != -1) {
        shortcodeText = "[" + selectedShortcode + "]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'header_fancy') {
        shortcodeText = "[header_fancy text=\"Your Header Text\"]<br />";
        return shortcodeText;
    }

    /* -------------- Message Shortcodes ------------------ */
    messageShortcodes = new Array("info", "note", "attention", "success", "warning", "tip", "errors");
    if (messageShortcodes.indexOf(selectedShortcode) != -1) {
        shortcodeText = "[" + selectedShortcode + " title=\"Optional Title\"]Your Message Text[/" + selectedShortcode + "]<br />";
        return shortcodeText;
    }

    /* ----------- Dropcaps ---------------- */

    if (selectedShortcode.match('dropcap[0-4]')) {
        shortcodeText = "[" + selectedShortcode + "]Y[/" + selectedShortcode + "]our text goes here.";
        return shortcodeText;
    }

    /* ----------- Tabs and Accordions ---------------- */
    if (selectedShortcode == 'tabs') {
        shortcodeText = "[tabgroup]<br />[tab title=\"Tab 1\"]Tab 1 content goes here.[/tab]<br />[tab title=\"Tab 2\"]Tab 2 content goes here.[/tab]<br />[tab title=\"Tab 3\"]Tab 3 content goes here.[/tab]<br />[/tabgroup]";
        return shortcodeText;
    }

    if (selectedShortcode == 'accordion') {
        shortcodeText = "[accordion]<br />[pane current=\"true\" title=\"Pane 1\"]Pane 1 content goes here.[/pane]<br />[pane title=\"Pane 2\"]Tab 2 content goes here.[/pane]<br />[pane title=\"Pane 3\"]Pane 3 content goes here.[/pane]<br />[/accordion]";
        return shortcodeText;
    }

    if (selectedShortcode == 'toggle') {
        shortcodeText = "[toggle type=\"first\" title=\"Toggle 1\"]Toggle 1 content goes here.[/toggle]<br />[toggle title=\"Toggle 2\"]Toggle 2 content goes here.[/toggle]<br />[toggle title=\"Toggle 3\"]Toggle 3 content goes here.[/toggle]<br />";
        return shortcodeText;
    }

    /* -------------- Posts Shortcodes -------------------------*/
    if (selectedShortcode == 'recent_posts' || selectedShortcode == 'popular_posts') {
        shortcodeText = "[" + selectedShortcode + "]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'category_posts') {
        shortcodeText = "[category_posts category_slugs=\"Slug1,Slug2\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'tag_posts') {
        shortcodeText = "[tag_posts tag_slugs=\"Slug1,Slug2\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'show_custom_post_types') {
        shortcodeText = "[show_custom_post_types post_types=\"Type1,Type2\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'custom_taxonomy_posts') {
        shortcodeText = "[custom_taxonomy_posts taxonomy_slug=\"Taxonomy Slug\" taxonomy_term=\"Taxonomy term\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'show_post_snippets') {
        shortcodeText = "[show_post_snippets number_of_columns=3 post_type=\"Type1,Type2\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'show_thumbnail_slider') {
        shortcodeText = "[show_thumbnail_slider post_type=\"Type1,Type2\"]<br />";
        return shortcodeText;
    }

    /* --------------- Social Shortcodes ------------------------ */

    if (selectedShortcode == 'social_list') {
        shortcodeText = "[social_list googleplus_url=\"http://plus.google.com\" facebook_url=\"http://www.facebook.com\" twitter_url=\"http://www.twitter.com\" youtube_url=\"http://www.youtube.com/\" linkedin_url=\"http://www.linkedin.com\" include_rss=\"true\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'subscribe_rss') {
        shortcodeText = "[subscribe_rss]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'donate') {
        shortcodeText = "[donate text=\"Donate Text\" account=\"Your Paypal email\" display_card_logos=\"Yes,No\" title=\"Donate to <replace with your name or organization>\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'private' || selectedShortcode == 'protected') {
        shortcodeText = "[" + selectedShortcode + "]Your Protected or Private Content here[/" + selectedShortcode + "]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'contact_form') {
        shortcodeText = "[contact_form mail_to=\"contact@yourcompany.com\"]<br />";
        return shortcodeText;
    }

    /* --------------- Box Shortcodes ------------------------ */

    if (selectedShortcode == 'box_frame2') {
        shortcodeText = "[box_frame2 title=\"Title for Box\" width=\"Specify width in pixels\"]Any HTML content goes here - images, lists, text paragraphs etc.[/box_frame2]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'box_frame') {
        shortcodeText = "[box_frame start_color=\"#d0e4f7\" end_color=\"#73b1e7\" border_color=\"#919599\" text_color=\"#000033\" width=\"Specify width in pixels\"]Any HTML content goes here - images, lists, text paragraphs etc.[/box_frame]<br />";
        return shortcodeText;
    }

    /* --------------- Video Shortcodes ------------------------ */

    if (selectedShortcode == 'html5_audio') {
        shortcodeText = "[html5_audio ogg_url=\"http://www.ogg\" mp3_url=\"http://www.mp3\" ]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'youtube_video') {
        shortcodeText = "[youtube_video clip_id=\"cL-ejzlRSsE\" hd=\"true\" width=560 height=315]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'vimeo_video') {
        shortcodeText = "[vimeo_video clip_id=\"15068747\" width=600 height=400]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'flash_video') {
        shortcodeText = "[flash_video video_url=\"http://www.youtube.com/v/sdUUx5FdySs\" width=600]<br />";
        return shortcodeText;
    }

    /* --------------- Miscellaneous Shortcodes ------------------------ */

    if (selectedShortcode == 'read_more') {
        shortcodeText = "[read_more text=\"Read More\" href=\"http://www.\" arrows=\"&rarr;\"]<br />";
        return shortcodeText;
    }

    if (selectedShortcode == 'responsive_slider') {
        shortcodeText = "[responsive_slider]<ul><li>Slide 1 content goes here.</li><li>Slide 2 content goes here.</li><li>Slide 3 content goes here.</li></ul>[/responsive_slider]";
        return shortcodeText;
    }

    // Default if none of the above shortcodes match
    if (!shortcodeText)
        shortcodeText = "[" + selectedShortcode + "] Replace with your content [/" + selectedShortcode + "]";

    return shortcodeText;
}

function shortcodeSubmit() {

    var shortcodeText;

    var mo_shortcode = document.getElementById('shortcode_panel');


    if (mo_shortcode.className.indexOf('current') != -1) {
        mo_shortcode = document.getElementById('shortcode_select').value;

    }

    shortcodeText = getshortcodeText(mo_shortcode);

    if (window.tinyMCE) {
        //TODO: For QTranslate we should use here 'qtrans_textarea_content' instead 'content'
        window.tinyMCE.execInstanceCommand('content', 'mceInsertContent', false, shortcodeText);
        //Peforms a clean up of the current editor HTML.
        //tinyMCEPopup.editor.execCommand('mceCleanup');
        //Repaints the editor. Sometimes the browser has graphic glitches.
        tinyMCEPopup.editor.execCommand('mceRepaint');
        tinyMCEPopup.close();
    }

}