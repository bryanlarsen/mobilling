<?php

function mo_image_shortcode($atts, $content = null, $code) {
    extract(shortcode_atts(array(
        'link' => false,
        'title' => '',
        'type' => 'thumbnail',
        'src' => '',
        'alt' => '',
        'align' => false,
        'image_frame' => false,
        'wrapper' => false,
        'width' => null,
        'height' => null,
        'wrapper_class' => '',
        'style' => '',
        'size' => 'medium'
    ), $atts));

    $output = '';
    if ($link)
        $output .= '<a href="' . $link . '" title="' . $title . '">';

    $output .= '<img';
    $output .= ' class="' . $type . '"';

    if (!$align)
        $align = '';
    else
        $align = ' align' . $align;

    $wrapper_class = $wrapper_class . ' image-box';

    // If the custom width and height is not specified
    if (!isset($height) && !isset($width)) {
        $image_size = mo_get_image_size_array($size, 'medium'); // default to medium if size is invalid

        $height = $image_size['height'];
        $width = $image_size['width'];

    }
    else {
        $size = '';
    }

    $style = $style ? ' style="' . $style . '"' : '';

    $image_url = aq_resize($src, $width, $height, true); //resize & crop the image if required

    $output .= ' src="' . $image_url . '"';

    if (!$alt)
        $output .= ' alt="' . $title . '"';
    else
        $output .= ' alt="' . $alt . '"';

    if (!$link)
        $output .= '>';
    else
        $output .= '></a>';

    // Image height and width for actual wp image while size attribute is for styling - to obtain appropriate css frame fitting this image
    if (mo_to_boolean($image_frame)) {
        $wrap = '<div class="' . $wrapper_class . $align . ' clearfix"' . $style . '>';
        $wrap .= '<div class="image-area'. $size .'">';
        $wrap .= $output;
        $wrap .= '</div></div>';

        $output = $wrap;
    }
    else {
        $wrap = '<div class="' . $wrapper_class . $align . ' clearfix"' . $style . '>';
        $wrap .= $output;
        $wrap .= '</div>';

        $output = $wrap;
    }

    return $output;
}

add_shortcode('image', 'mo_image_shortcode');