<?php
/*
 * Various utility functions required by theme defined here
 * 
 * @package Livemesh_Framework
 *
 */

if (!function_exists('mo_get_entry_title')) {
    function mo_get_entry_title() {
        global $post;

        if (is_front_page() && !is_home())
            $title = the_title('<h2 class="' . esc_attr($post->post_type) . '-title entry-title"><a href="' . get_permalink() . '"
                                                                                        title="' . get_the_title() . '"
                                                                                        rel="bookmark">', '</a></h2>',
                false);
        elseif (is_singular())
            $title = the_title('<h1 class="' . esc_attr($post->post_type) . '-title entry-title">', '</h1>', false);
        else
            $title = the_title('<h2 class="entry-title"><a href="' . get_permalink() . '" title="' . get_the_title() . '"
                                               rel="bookmark">', '</a></h2>', false);

        /* If there's no post title, return a default title */
        if (empty($title)) {
            if (!is_singular()) {
                $title = '<h2 class="entry-title no-entry-title"><a href="' . get_permalink() . '" rel="bookmark">' . __('(Untitled)',
                        'mo_theme') . '</a></h2>';
            }
            else {
                $title = '<h1 class="entry-title no-entry-title">' . __('(Untitled)', 'mo_theme') . '</h1>';
            }
        }

        return $title;
    }
}

if (!function_exists('mo_entry_author')) {

    function mo_entry_author() {
        $author = '<span class="author vcard">' . __('Author: ', 'mo_theme') . '<a class="url fn n" href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '" title="' . esc_attr(get_the_author_meta('display_name')) . '">' . get_the_author_meta('display_name') . '</a></span>';
        return $author;
    }
}

if (!function_exists('mo_entry_published')) {

    function mo_entry_published($format = "M d, Y") {


        global $post;

        $post_id = $post->ID;

        $prefix = __('On: ', 'mo_theme');

        $link = '<span class="published">' . $prefix . '<a href="' . get_day_link(get_the_time(__('Y', 'mo_theme')), get_the_time(__('m', 'mo_theme')), get_the_time(__('d', 'mo_theme'))) . '" title="' . sprintf(get_the_time(esc_attr__('l, F, Y, g:i a', 'mo_theme'))) . '">' . get_the_time($format) . '</a></span>';

        return $link;

        $published = '<span class="published">' . $prefix . ' <abbr title="' . sprintf(get_the_time(esc_attr__('l, F, Y, g:i a', 'mo_theme'))) . '">' . sprintf(get_the_time($format)) . '</abbr></span>';

        return $published;
    }
}

if (!function_exists('mo_custom_entry_published')) {

    function mo_custom_entry_published() {

        $published = '<span class="published"><abbr title="' . sprintf(get_the_time(esc_attr__('l, F, Y, g:i a', 'mo_theme'))) . '"><span class="month">' . sprintf(get_the_time('M')) . '</span><span class="date">' . sprintf(get_the_time('d')) . '</span></abbr></span>';
        return $published;
    }
}

if (!function_exists('mo_entry_terms_list')) {

    function mo_entry_terms_list($taxonomy = 'category', $separator = ', ', $before = ' ', $after = ' ') {
        global $post;

        $output = '<span class="' . $taxonomy . '">';
        if ($taxonomy == 'post_tag')
            $output .= '';
        else
            $output .= __('Categories: ', 'mo_theme');
        $output .= get_the_term_list($post->ID, $taxonomy, $before, $separator, $after);
        $output .= '</span>';

        return $output;
    }
}

if (!function_exists('mo_entry_terms_text')) {

    function mo_entry_terms_text($taxonomy = 'category', $separator = ' , ') {
        global $post;

        $terms = get_the_terms($post, $taxonomy);
        foreach ($terms as $term)
            $term_names[] = $term->name;

        $output = implode($separator, $term_names);

        return $output;
    }
}

if (!function_exists('mo_get_post_snippets')) {

// Display grid style posts layout for portfolio or regular posts
    function mo_get_post_snippets($args) {
        global $mo_theme;

        $mo_theme->set_context('loop', 'portfolio'); // tells the thumbnail functions to prepare lightbox constructs for the image
        $layout_manager = MO_LayoutManager::getInstance();

        $output = $layout_manager->get_post_snippets_layout($args);

        $mo_theme->set_context('loop', null); //reset it
        return $output;

    }
}

if (!function_exists('mo_get_post_snippets_list')) {

// Display posts snippets list for flexslider carousel
    function mo_get_post_snippets_list($args) {
        $layout_manager = MO_LayoutManager::getInstance();

        $output = $layout_manager->get_post_snippets_list($args);

        return $output;

    }
}

if (!function_exists('mo_display_post_nuggets_grid_style')) {

    function mo_display_post_nuggets_grid_style($args) {

        /* Set the default arguments. */
        $defaults = array(
            'loop' => null,
            'number_of_columns' => 2,
            'image_size' => 'medium',
            'excerpt_count' => 120,
            'show_meta' => false,
            'style' => null
        );

        /* Merge the input arguments and the defaults. */
        $args = wp_parse_args($args, $defaults);

        /* Extract the array to allow easy use of variables. */
        extract($args);

        $style_class = mo_get_column_style($number_of_columns);

        if ($loop->have_posts()) :
            $post_count = 0;

            $first_row = true;
            $last_column = false;

            $style = ($style ? ' ' . $style : '');

            echo '<div class="post-list' . $style . '">';

            while ($loop->have_posts()) : $loop->the_post();

                if ($last_column) {
                    echo '<div class="start-row"></div>';
                    $first_row = false;
                }

                if (++$post_count % $number_of_columns == 0)
                    $last_column = true;
                else
                    $last_column = false;

                echo '<div class="' . $style_class . ' clearfix' . ($last_column ? ' last' : '') . '">';

                echo '<div class="' . join(' ', get_post_class()) . ($first_row ? ' first' : '') . '">';

                $thumbnail_exists = mo_thumbnail(array('image_size' => $image_size, 'wrapper' => true, 'size' => 'full'));

                echo '<div class="entry-text-wrap' . ($thumbnail_exists ? '' : ' nothumbnail') . '">';

                $before_title = '<div class="entry-title"><a href="' . get_permalink() . '" title="' . the_title_attribute('echo=0') . '" rel="bookmark">';
                $after_title = '</a></div>';

                the_title($before_title, $after_title);

                if ($show_meta)
                    echo '<div class="byline">' . mo_entry_published() . mo_entry_comments_number() . '</div>';

                if ($excerpt_count != 0) {
                    echo '<div class="entry-summary">';
                    echo mo_truncate_string(get_the_excerpt(), $excerpt_count);
                    echo '</div><!-- .entry-summary -->';
                }

                echo '</div><!-- entry-text-wrap -->';

                echo '</div><!-- .hentry -->';

                echo '</div> <!-- .column-class -->';

            endwhile;

            echo '</div> <!-- post-list -->';

            echo '<div class="clear"></div>';

        endif;

        wp_reset_postdata(); // Right placement to help not lose context information
    }
}

if (!function_exists('mo_get_post_image_size')) {

    function mo_get_post_image_size($size_name) {
        // Translate user language to to theme specific image size
        if ($size_name == "small")
            $size_name = "mini";
        elseif ($size_name == "medium")
            $size_name = "small";
        else
            $size_name = "mini";

        return $size_name;
    }
}

if (!function_exists('mo_get_thumbnail_post_list')) {
    function mo_get_thumbnail_post_list($args) {

        /* Set the default arguments. */
        $defaults = array(
            'loop' => null,
            'image_size' => 'small',
            'style' => null,
            'show_meta' => false,
            'excerpt_count' => 120,
            'hide_thumbnail' => false
        );

        /* Merge the input arguments and the defaults. */
        $args = wp_parse_args($args, $defaults);

        /* Extract the array to allow easy use of variables. */
        extract($args);

        if ($loop->have_posts()):

            $css_class = $image_size . '-size';

            $image_size = mo_get_post_image_size($image_size);

            $style = ($style ? ' ' . $style : '');

            $output = '<ul class="post-list' . $style . ' ' . $css_class . '">';

            $hide_thumbnail = mo_to_boolean($hide_thumbnail);

            $show_meta = mo_to_boolean($show_meta);

            while ($loop->have_posts()) : $loop->the_post();

                $output .= '<li>';

                $thumbnail_exists = false;

                $output .= "\n" . '<div class="' . join(' ', get_post_class()) . '">' . "\n"; // Removed id="post-'.get_the_ID() to help avoid duplicate IDs validation error in the page

                if (!$hide_thumbnail) {
                    $thumbnail_url = mo_get_thumbnail(array('image_size' => $image_size));
                    if (!empty($thumbnail_url)) {
                        $thumbnail_exists = true;
                        $output .= $thumbnail_url;
                    }
                }

                $output .= "\n" . '<div class="entry-text-wrap ' . ($thumbnail_exists ? '' : 'nothumbnail') . '">';

                $output .= "\n" . the_title('<div class="entry-title"><a href="' . get_permalink() . '" title="' . the_title_attribute('echo=0') . '" rel="bookmark">', '</a></div>', false);

                if ($show_meta) {
                    $output .= '<div class="byline">' . mo_entry_published() . mo_entry_comments_number() . '</div>';
                }

                if ($excerpt_count != 0) {

                    $output .= "\n" . '<div class="entry-summary">';

                    $excerpt_text = mo_truncate_string(get_the_excerpt(), $excerpt_count);
                    $output .= $excerpt_text;

                    $output .= "\n" . '</div><!-- entry-summary -->';
                }

                $output .= "\n" . '</div><!-- entry-text-wrap -->';

                $output .= "\n" . '</div><!-- .hentry -->';

                $output .= '</li>';

            endwhile;

            $output .= '</ul>';

        endif;

        wp_reset_postdata();

        return $output;
    }
}
