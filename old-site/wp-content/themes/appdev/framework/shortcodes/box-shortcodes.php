<?php

if (!function_exists('mo_box_shortcode')) {

    function mo_box_shortcode($atts, $content = null, $shortcode_name = "") {

        extract(shortcode_atts(array(
            'title' => null
        ), $atts));

        $icon_mapping = array('info' => 'icon-info', 'warning' => 'icon-warning', 'note' => 'icon-pen');

        if ($title) {
            $title = '<div class="title" > ' . $title . '</div> ';
        }
        return '<div class="message-box ' . $shortcode_name . '">' . $title . '<div class="contents">' . do_shortcode($content) . '<a href="#" class="close"><i class="icon-cross-2"></i></a></div></div > ';
    }
}

if (!function_exists('mo_box_frame_shortcode')) {
    function mo_box_frame_shortcode($atts, $content = null, $shortcode_name = "") {
        extract(shortcode_atts(array(
            'style' => '',
            'align' => 'center',
            'start_color' => "#FFFFFF",
            'end_color' => "#EEEEEE",
            'border_color' => "#ccc",
            'text_color' => "#333",
            'type' => null,
            'width' => null
        ), $atts));

        $type = $type ? ' ' . $type : '';
        $output = '<div class="' . str_replace('_', '-', $shortcode_name) . ' align' . $align . $type . '"';
        $output .= ' style = "';
        $output .= $width ? 'width:' . $width . ';' : '';
        $output .= $style;
        $output .= 'filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'' . $start_color . '\', endColorstr=\'' . $end_color . '\'); /* for IE */';
        $output .= 'background:-moz-linear-gradient(center top , ' . $start_color . ',' . $end_color . ') repeat scroll 0 0 transparent;';
        $output .= 'background: -webkit-gradient(linear, center top, center bottom, from(' . $start_color . '), to(' . $end_color . '));';
        $output .= 'border:1px solid ' . $border_color . ';background-color:' . $end_color . ';color:' . $text_color . ';"';
        $output .= ' > ';
        $output .= do_shortcode($content);
        $output .= '</div > ';
        return $output;
    }
}

if (!function_exists('mo_box_frame2_shortcode')) {
    function mo_box_frame2_shortcode($atts, $content = null, $shortcode_name = "") {
        extract(shortcode_atts(array(
            'style' => false,
            'align' => 'center',
            'title' => null,
            'style' => null,
            'type' => null,
            'width' => null,
            'inner_style' => null
        ), $atts));

        $type = $type ? ' ' . $type : '';
        $output = '<div class="' . str_replace('_', '-', $shortcode_name) . ' align' . $align . $type . '"';
        if (isset($style) || isset($width)) {
            $output .= ' style = "';
            $output .= $width ? 'width:' . $width . ';' : '';
            $output .= $style;
            $output .= '"';
        }
        $output .= '> ';
        if ($title)
            $output .= '<div class="box-header" > ' . $title . '</div > ';
        $output .= '<div class="box-contents"';
        $output .= $inner_style ? ' style = "' . $inner_style . '"' : '';
        $output .= ' > ';
        $output .= do_shortcode($content);
        $output .= '</div ></div > ';
        return $output;
    }
}


add_shortcode('info', 'mo_box_shortcode');
add_shortcode('note', 'mo_box_shortcode');
add_shortcode('attention', 'mo_box_shortcode');
add_shortcode('success', 'mo_box_shortcode');
add_shortcode('warning', 'mo_box_shortcode');
add_shortcode('tip', 'mo_box_shortcode');
add_shortcode('errors', 'mo_box_shortcode');
add_shortcode('box_frame', 'mo_box_frame_shortcode');
add_shortcode('box_frame2', 'mo_box_frame2_shortcode');

