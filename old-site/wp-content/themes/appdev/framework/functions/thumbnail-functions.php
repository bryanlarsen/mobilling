<?php
/*
 * Use Wordpress Post Thumbnail and Aqua Resizer to resize Get_The_Image thumbnails
 *
 * @package Livemesh_Framework
 *
*/

if (!function_exists('mo_get_custom_sized_image')) {
    function mo_get_custom_sized_image($src, $image_size, $css_class, $title = '') {
        //image_size can be an array with height and width key value pairs or a string
        if (is_string($image_size))
            $image_size = mo_get_image_size_array($image_size);

        $width = $image_size['width'];
        $height = $image_size['height'];


        $image_url = aq_resize($src, $width, $height, true);

        $output = '<img alt="' . $title . '" class="' . $css_class . '" src="' . $image_url . '" />';

        return $output;
    }
}

if (!function_exists('mo_show_image_info')) {

    /* Return false to disable image info on hover */
    function mo_show_image_info($context) {

        if ($context == 'portfolio') {
            $enable_hover = mo_get_theme_option('mo_disable_portfolio_hover') ? false : true;
            return $enable_hover;
        }

        return ($context == 'archive' || $context == 'starter');

    }
}

if (!function_exists('mo_thumbnail')) {
    function mo_thumbnail($args) {

        $thumbnail_element = mo_get_thumbnail($args);

        if (!empty($thumbnail_element)) {
            echo $thumbnail_element;
            return true;
        }

        return false;
    }
}

if (!function_exists('mo_get_thumbnail')) {

    /** IMP: Make sure you disable caching on get_the_image front by sending cache = false. */
    function mo_get_thumbnail($args) {
        global $mo_theme;

        $context = $mo_theme->get_context('loop');

        $defaults = array('format' => 'array',
            'size' => 'full',
            'image_scan' => false,
            'youtube_scan' => false,
            'wrapper' => true,
            'show_image_info' => false,
            'before_html' => '',
            'after_html' => '',
            'image_class' => 'thumbnail',
            'image_alt' => '',
            'image_title' => '',
            'meta_key' => array(),
            'style_size' => false,
            'the_post_thumbnail' => true, // Keep this true to enable featured posts
            'force_aqua_resizer' => true,
            'taxonamy' => 'category',
            'cache' => false, // WordPress handles image caching for you.
        );
        $args = wp_parse_args($args, $defaults);


        /* Extract the array to allow easy use of variables. */
        extract($args);

        $output = '';

        //image_size can be an array with height and width key value pairs or a string
        if (is_string($image_size)) {
            $image_size = mo_get_image_size_array($image_size);
            $args['force_aqua_resizer'] = false; // we have the wp sizes taken care of
        }

        $args['height'] = $image_size['height'];
        $args['width'] = $image_size['width'];

        $thumbnail_urls = mo_get_thumbnail_urls($args);

        //create the thumbnail
        if (!empty($thumbnail_urls)) {


            $thumbnail_src = $thumbnail_urls[0];
            $thumbnail_element = $thumbnail_urls[1];

            $post_id = get_the_ID();

            $post_title = get_the_title($post_id);
            $post_link = get_permalink($post_id);

            if (empty($before_html)) {
                $before_html = '<a title="' . $post_title . '" href="' . $post_link . ' ">';
                $after_html = '</a>' . $after_html;
            }

            if ($wrapper) {
                $wrapper_html = '<div class="image-area">';
                $before_html = $wrapper_html . $before_html;
                if (mo_show_image_info($context) || $show_image_info) {
                    $image_info = '';
                    $image_info .= '<div class="image-info">';
                    $image_info .= '<h3 class="post-title"><a title="' . $post_title . '" href="' . $post_link . ' ">' . $post_title . '</a></h3>';
                    $image_info .= mo_get_taxonamy_info($taxonamy);
                    $image_info .= '<div class="image-info-buttons">';
                    $rel_attribute = 'rel="prettyPhoto[' . $context . ']" ';
                    // point me to the source of the image for lightbox preview
                    $image_info .= '<a class="lightbox-link" ' . $rel_attribute . 'title="' . $post_title . '" href="' . $thumbnail_src . ' "><span>Preview</span></a>';
                    $image_info .= '</div>';
                    $image_info .= '</div>';

                    $after_html .= $image_info;
                }
                $after_html .= '</div>'; // end of image-area
            }

            $output = $before_html;
            $output .= $thumbnail_element;
            $output .= $after_html;
        }
        return $output;
    }
}

if (!function_exists('mo_get_taxonamy_info')) {

    function mo_get_taxonamy_info($taxonamy) {
        $output = '';
        $terms = get_the_terms(get_the_ID(), $taxonamy);
        if ($terms) {
            $output .= '<div class="terms">';
            $term_count = 0;
            foreach ($terms as $term) {
                if ($term_count != 0)
                    $output .= ', ';
                $output .= '<a href="' . get_term_link($term->slug, $taxonamy) . '">' . $term->name . '</a>';
                $term_count = $term_count + 1;
            }
            $output .= '</div>';
        }
        return $output;
    }
}

if (!function_exists('mo_get_thumbnail_urls')) {

    function mo_get_thumbnail_urls($args) {

        // TODO: Keep Aqua default for now. Change it later.
        $thumbnail_gen_option = mo_get_theme_option('mo_thumbnail_generation', 'Aqua');

        if ($thumbnail_gen_option == 'Aqua' || $args['force_aqua_resizer'])
            $thumbnail_urls = mo_get_aqua_thumbnail_urls($args);
        else
            $thumbnail_urls = mo_get_wp_thumbnail_urls($args);

        return $thumbnail_urls;
    }
}

if (!function_exists('mo_get_aqua_thumbnail_urls')) {

    function mo_get_aqua_thumbnail_urls($args) {

        /* Extract the array to allow easy use of variables. */
        extract($args);

        $img_src = '';
        $thumbnail_element = '';


        /* If no meta key is specified and thumbnail is true, check the thumbnail custom key
    * before proceeding with other options like post scan */
        if ($size == 'thumbnail' && empty($args['meta_key']))
            $args['meta_key'] = array('Thumbnail', 'thumbnail');

        //first crank up get-the-image, and ask for it's output as an array
        if (function_exists('get_the_image')) {

            $image_array = get_the_image($args);

            if (isset($image_array['src'])) {
                $img_src = $image_array['src'];
            }

            $thumbnail_urls = array();
            //create the thumbnail
            if (!empty($img_src)) {

                if (empty($image_alt)) {
                    $image_alt = $image_array['alt'];
                }

                if (empty($image_title)) {
                    $image_title = $image_array['alt'];
                }

                if (empty($image_class)) {
                    $image_class = $image_array['class'];
                }

                $style = '';

                if ($style_size)
                    $style = 'style="width:' . $width . 'px; height:' . $height . 'px;"';

                $image_url = aq_resize($img_src, $width, $height, true); //resize & crop the image

                $thumbnail_element .= '<img ' . $style . ' class="' . $image_class . '" src="' . $image_url . '" alt="' . $image_alt . '" title="' . $image_title . '"/>';

                $thumbnail_urls[0] = $img_src;
                $thumbnail_urls[1] = $thumbnail_element;
            }
        }
        return $thumbnail_urls;
    }
}

if (!function_exists('mo_get_wp_thumbnail_urls')) {

    function mo_get_wp_thumbnail_urls($args) {
        extract($args);

        $thumbnail_urls = array();

        $post_ID = get_the_ID();

        // 1- First get me the link to featured image src
        $feature_image_id = get_post_thumbnail_id($post_ID);
        $feature_image_src = wp_get_attachment_image_src($feature_image_id, 'full');

        if ($feature_image_src) {
            $feature_image_src = $feature_image_src[0];
            // 2- Now get me the complete img element
            $atts = array('class' => $image_class, 'alt' => $image_alt, 'title' => $image_title);


            // make sure you pass the string thumbnail size instead of array to avoid image downsizing by WordPress
            $thumbnail_element = get_the_post_thumbnail($post_ID, $image_size, $atts);

            $thumbnail_urls[0] = $feature_image_src;
            $thumbnail_urls[1] = $thumbnail_element;
        }

        return $thumbnail_urls;
    }
}