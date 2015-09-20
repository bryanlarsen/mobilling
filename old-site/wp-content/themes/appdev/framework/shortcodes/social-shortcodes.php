<?php
/* Subscribe to RSS feed */

function mo_subscribe_rss() {
    $feed_url = home_url() . '/feed';
    return '<div class="rss-block">Like what you see? <a href="' . $feed_url . '">Subscribe to RSS feed</a> to receive updates!</div>';

}

add_shortcode('subscribe_rss', 'mo_subscribe_rss');

function mo_social_list_shortcode($atts, $content = null, $code) {
    extract(shortcode_atts(array(
        'facebook_url' => false,
        'twitter_url' => false,
        'flickr_url' => false,
        'youtube_url' => false,
        'linkedin_url' => false,
        'googleplus_url' => false,
        'include_rss' => false,
        'align' => 'left'
    ), $atts));


    $output = '<ul class="social-list clearfix';
    if ($align == 'center')
        $output .= ' center';
    $output .= '">';

    if ($facebook_url)
        $output .= '<li><a class="facebook" href="' . $facebook_url . '" target="_blank" title="Follow on Facebook">Facebook</a></li>';
    if ($twitter_url)
        $output .= '<li><a class="twitter" href="' . $twitter_url . '" target="_blank" title="Subscribe to Twitter Feed">Twitter</a></li>';
    if ($flickr_url)
        $output .= '<li><a class="flickr" href="' . $flickr_url . '" target="_blank" title="View Flickr Portfolio">Flickr</a></li>';
    if ($youtube_url)
        $output .= '<li><a class="youtube" href="' . $youtube_url . '" target="_blank" title="Subscribe to the YouTube channel">YoutTube</a></li>';
    if ($linkedin_url)
        $output .= '<li><a class="linkedin" href="' . $linkedin_url . '" target="_blank" title="View LinkedIn Profile">LinkedIn</a></li>';
    if ($googleplus_url)
        $output .= '<li><a class="googleplus" href="' . $googleplus_url . '" target="_blank" title="Follow on Google Plus">Google Plus</a></li>';

    if ($include_rss) {
        $rss = get_bloginfo('rss2_url');
        $output .= '<li><a class="rss" href="' . $rss . '" target="_blank" title="Subscribe to our RSS Feed">RSS</a></li>';
    }

    $output .= '</ul>';

    return $output;

}

add_shortcode('social_list', 'mo_social_list_shortcode');

/*------- Paypal Donate Button - http://blue-anvil.com/archives/8-fun-useful-shortcode-functions-for-wordpress/ ----*/

function mo_paypal_donate_shortcode($atts) {
    extract(shortcode_atts(array(
        'title' => 'Make a donation',
        'account' => 'REPLACE ME',
        'for' => '',
        'display_card_logos' => "Yes",
    ), $atts));

    global $post;

    if (!$for) $for = str_replace(" ", "+", $post->post_title);

    if ($display_card_logos == "Yes")
        $class = 'donate-button-plus';
    else
        $class = 'donate-button';

    return '<a class="' . $class . '" href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=' . $account . '&item_name=Donation+for+' . $for . '" title="' . $title . '"></a>';

}

add_shortcode('donate', 'mo_paypal_donate_shortcode');