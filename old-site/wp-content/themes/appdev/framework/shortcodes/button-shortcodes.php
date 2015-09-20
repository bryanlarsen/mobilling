<?php

if (!function_exists('mo_button_shortcode')) {

    function mo_button_shortcode($atts, $content = null) {
        extract(shortcode_atts(
            array(
                'style' => null,
                'color' => '',
                'align' => false,
                'element_id' => false,
                'size' => '',
                'type' => '',
                'class' => 'button',
                'href' => '',
                'link_target' => '_self'),
            $atts));

        $color = ' ' . $color;
        if (!empty($size))
            $size = ' ' . $size;
        if (!empty($type))
            $type = ' ' . $type;
        $button_text = trim($content);
        $id_text = $element_id ? ' id ="' . $element_id . '"' : '';
        $style = $style ? ' style="' . $style . '"' : '';

        $button_content = '<a' . $id_text . ' class= "' . $class . $color . $size . $type . '"' . $style . ' href="' . $href . '" target="' . $link_target . '">' . $button_text . '</a>';
        if ($align)
            $button_content = '<div style="text-align:' . $align . ';float:' . $align . ';">' . $button_content . '</div>';
        return $button_content;
    }
}

add_shortcode('button', 'mo_button_shortcode');

if (!function_exists('mo_read_more_shortcode')) {

    /* Example -
     * [read_more text="Read More" href="#" align="left" target="_self" arrows=" >>"]
     */
    function mo_read_more_shortcode($atts, $content = null) {
        extract(shortcode_atts(array(
            'text' => __('Read More', 'mo_theme'),
            'href' => '',
            'style' => null,
            'id' => null,
            'arrows' => ' &rarr;',
            'target' => '_self'), $atts));

        $text = trim($text);

        $read_more_link = '<a href="' . $href . '" target="' . $target . '" title="' . $text . '">' . $text . $arrows . '</a>';
        $read_more_link = '<div ' . ($id ? 'id="' . $id . '"' : '') . ' class="read-more" ' . ($style ? ' style="' . $style . '"' : '') . '>' . $read_more_link . '</div>';
        return $read_more_link;
    }
}
add_shortcode('read_more', 'mo_read_more_shortcode');
?>