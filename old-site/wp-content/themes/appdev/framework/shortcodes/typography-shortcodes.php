<?php

/* Shortcode for source code formatting */
function mo_sourcecode_shortcode($atts, $content = null, $shortcode_name = "") {
    return '<pre class="code">' . $content . '</pre>';
}

add_shortcode('code', 'mo_sourcecode_shortcode');

/* Shortcodes for dropcaps. Four types of dropcaps supported with multiple colors*/
function mo_dropcap_shortcode($atts, $content = null, $shortcode_name = "") {

    extract(shortcode_atts(array('color' => false, 'text_color' => false, 'style' => ''), $atts));

    if (isset($shortcode_name))
        $style_class = $shortcode_name;

    if (in_array($shortcode_name, array('dropcap2', 'dropcap3', 'dropcap4', 'dropcap5'))) {
        $style .= $color ? 'background-color:' . $color . ';' : '';
    }

    $style .= $text_color ? 'color:' . $text_color . ';' : '';

    if (!empty($style))
        $style = ' style="' . $style . '"';

    $dropcap_code = '<span class="' . $style_class . '"' . $style . '>' . do_shortcode($content) . '</span>';

    return $dropcap_code;

}

add_shortcode('dropcap1', 'mo_dropcap_shortcode');
add_shortcode('dropcap2', 'mo_dropcap_shortcode');
add_shortcode('dropcap3', 'mo_dropcap_shortcode');
add_shortcode('dropcap4', 'mo_dropcap_shortcode');
add_shortcode('dropcap5', 'mo_dropcap_shortcode');


/* Shortcode for pull quotes with optional alignment = left or right or none */
function mo_pullquote_shortcode($atts, $content = null, $shortcode_name = "") {

    extract(shortcode_atts(array('align' => 'none', 'author' => false,), $atts));

    $pullquote_code = '<div class="quote-wrap align' . $align . '"><div class="' . $shortcode_name . '">' . do_shortcode($content) . '</div></div>';

    return $pullquote_code;

}

add_shortcode('pullquote', 'mo_pullquote_shortcode');

/* Shortcode for blockquotes with optional alignment = left or right and citation attributes*/
function mo_blockquote_shortcode($atts, $content = null, $shortcode_name = "") {

    extract(shortcode_atts(array('align' => 'none', 'author' => false, 'affiliation' => false, 'affiliation_url' => false, 'style' => ''), $atts));

    if (!empty($style))
        $style = ' style="' . $style . '"';

    $author_info = '';

    if ($author || $affiliation) {
        $author_info = '<p class="author">- ';
        $author_info .= $author ? $author : '';
        $author_info .= $affiliation ? ', ' : '';
        if ($affiliation && $affiliation_url)
            $author_info .= '<a href="' . $affiliation_url . '" title="' . $affiliation . '">' . $affiliation . '</a>';
        elseif ($affiliation)
            $author_info .= ', ' . $affiliation;

        $author_info .= '</p>';
    }

    $output = '<blockquote class="align' . $align . '"' . $style . '>' . $content . $author_info . '</blockquote>';

    return $output;

}

add_shortcode('blockquote', 'mo_blockquote_shortcode');

/* Shortcode for highlighting text within the content */
function mo_highlight_shortcode($atts, $content = null, $shortcode_name = "") {

    $output = '<span class="' . $shortcode_name . '">' . do_shortcode($content) . '</span>';

    return $output;

}

add_shortcode('highlight1', 'mo_highlight_shortcode');
add_shortcode('highlight2', 'mo_highlight_shortcode');

function mo_list_shortcode($atts, $content = null) {
    extract(shortcode_atts(array('style' => '', 'type' => 'list1'), $atts));

    $list_content = do_shortcode($content);

    if (!empty($style))
        $style = ' style="' . $style . '"';


    $styled_list = '<ul class="' . $type . '"' . $style . '>';

    $output = str_replace('<ul>', $styled_list, $list_content);

    return $output;
}

add_shortcode('list', 'mo_list_shortcode');


function mo_heading2_shortcode($atts, $content = null) {
    extract(shortcode_atts(array('style' => '',
            'heading_text' => '',
            'separator' => false,
            'pitch_text' => ''),
        $atts));

    if (!empty($style))
        $style = ' style="' . $style . '"';
    $output = '<div class="heading2" ' . $style . '>';
    if (!empty ($heading_text))
        $output .= '<h2 class="title ' . ($separator ? 'separator' : '') . '">' . $heading_text . '</h2>';
    if (!empty ($pitch_text))
        $output .= '<p class="pitch">' . $pitch_text . '</p>';

    $output .= do_shortcode($content);

    $output .= '</div>';

    return $output;
}

add_shortcode('heading2', 'mo_heading2_shortcode');

function mo_segment_shortcode($atts, $content = null) {
    extract(shortcode_atts(array(
            'id' => '',
            'class' => '',
            'style' => '',
            'background_pattern' => '',
            'background_color' => '',
            'background_image' => '',
            'parallax_background' => 'true',
            'background_speed' => 0),
        $atts));

    if ($id)
        $id = 'id="' . $id . '"';

    if (!empty($style) || !empty ($background_image) || !empty($background_color) || !empty($background_pattern)) {
        $inline_style = ' style="';
        $parallax_markup = '';
        if (!empty($background_image)) {
            $inline_style .= 'background-image:url(' . $background_image . '); background-color:' . $background_color . ';';
            if ($parallax_background == 'true') {
                $inline_style .= 'background-attachment:fixed;';
                $parallax_markup = ' data-stellar-background-ratio="' . $background_speed . '"';
            }
        }
        elseif (!empty($background_pattern)) {
            $inline_style .= 'background:url(' . $background_pattern . ') repeat scroll left top ' . $background_color . ';';
        }
        elseif (!empty($background_color)) {
            $inline_style .= 'background-color:' . $background_color . ';';
        }
        $inline_style .= $style . '"'; // let the style override what we specify above using background shorthand
        $output = '<div ' . $id . $parallax_markup . ' class="segment clearfix ' . $class . '" ' . $inline_style . '>';
        $output .= '<div class="segment-content">' . do_shortcode(mo_remove_wpautop($content)) . '</div>';
        $output .= '</div><!-- .segment-->';
    }
    else {
        $output = '<div ' . $id . ' class="segment clearfix ' . $class . '"><div class="segment-content">' . do_shortcode(mo_remove_wpautop($content)) . '</div></div><!-- .segment-->';
    }

    return $output;
}

add_shortcode('segment', 'mo_segment_shortcode');