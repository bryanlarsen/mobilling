<?php

function mo_divider_shortcode($atts, $content = null, $shortcode_name = "") {
    extract(shortcode_atts(array(
        'style' => null
    ), $atts));

    return '<div class="' . str_replace('_', '-', $shortcode_name) . '"' . ($style ? (' style="' . $style . '"') : '') . '></div>';
}

add_shortcode('divider', 'mo_divider_shortcode');
add_shortcode('divider_space', 'mo_divider_shortcode');
add_shortcode('divider_line', 'mo_divider_shortcode');
add_shortcode('divider_fancy', 'mo_divider_shortcode');

function mo_divider_top_shortcode() {
    return '<div class="divider top-of-page"><a href="#top" title="Top of Page" class="back-to-top">Back to Top</a></div>';
}

add_shortcode('divider_top', 'mo_divider_top_shortcode');

function mo_clear_shortcode() {
    return '<div class="clear"></div>';
}

add_shortcode('clear', 'mo_clear_shortcode');

function mo_header_shortcode($atts, $content = null, $shortcode_name = "") {
    extract(shortcode_atts(array(
        'id' => '',
        'text' => '',
        'style' => null
    ), $atts));

    return '<div' . ($id ? (' id="' . $id . '"') : '') . ' class="' . str_replace('_', '-', $shortcode_name) . '"' . ($style ? (' style="' . $style . '"') : '') . '><span>' . $text . '</span></div>';
}

add_shortcode('header_fancy', 'mo_header_shortcode');
add_shortcode('header_fancy2', 'mo_header_shortcode');
add_shortcode('header_fancy4', 'mo_header_shortcode');


