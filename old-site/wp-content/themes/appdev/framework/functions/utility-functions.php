<?php
/*
* Various utility functions required by theme defined here
*
* @package Livemesh Framework
*/

/*
* Obtain the prefix for my theme
*/
if (!function_exists('mo_get_prefix')) {
    function mo_get_prefix() {
        return 'mo';
    }
}

if (!function_exists('mo_exec_action')) {
    function mo_exec_action($hook, $arg = '') {
        $prefix = mo_get_prefix();

        do_action("{$prefix}_{$hook}", $arg);
    }
}

if (!function_exists('mo_remove_wpautop')) {
    function mo_remove_wpautop($content) {

        $content = do_shortcode(shortcode_unautop($content));
        $content = preg_replace('#^<\/p>|^<br\s?\/?>|<p>$|<p>\s*(&nbsp;)?\s*<\/p>#', '', $content);
        return $content;
    }
}

if (!function_exists('mo_get_theme_skin')) {
    /**
     * @return string
     */
    function mo_get_theme_skin() {
        $theme_skin = null;
        if (isset($_GET['skin']))
            $theme_skin = $_GET['skin'];
        if (empty($theme_skin)) {
            $theme_skin = mo_get_theme_option('mo_theme_skin', 'Default');
        }
        $skin_name = strtolower($theme_skin);
        return $skin_name;
    }
}

if (!function_exists('mo_site_logo')) {
    function mo_site_logo() {
        $heading_tag = (is_home() || is_front_page()) ? 'h1' : 'div';

        $blog_name = esc_attr(get_bloginfo('name'));

        $output = '<' . $heading_tag . ' id="site-logo"><a href="' . home_url('/') . '" title="' . $blog_name . '" rel="home">';

        $use_text_logo = mo_get_theme_option('mo_use_text_logo') ? true : false;
        $logo_url = mo_get_theme_option('mo_site_logo');

        // If no logo image is specified, use text logo
        if ($use_text_logo || empty ($logo_url)) {
            $output .= '<span>' . $blog_name . '</span>';
        }
        else {
            $output .= '<img class="standard-logo" src="' . $logo_url . '" alt="' . $blog_name . '"/>';
            $retina_logo_url = mo_get_theme_option('mo_retina_site_logo');
            if (!empty($retina_logo_url)) {
                $retina_logo_width = intval(mo_get_theme_option('mo_retina_site_logo_width')) / 2;
                $retina_logo_height = intval(mo_get_theme_option('mo_retina_site_logo_height')) / 2;
                $output .= '<img class="retina-logo" src="' . $retina_logo_url . '" width="' . $retina_logo_width . '" height="' . $retina_logo_height . '" alt="' . $blog_name . '"/>';
            }
        }

        $output .= '</a></' . $heading_tag . '>';

        echo $output;

    }
}

if (!function_exists('mo_browser_supports_css3_animations')) {
    function mo_browser_supports_css3_animations() {
        //check for ie7-9
        if (preg_match('/MSIE\s([\d.]+)/', $_SERVER['HTTP_USER_AGENT'], $matches)) {
            return false;
        }

        //Disable animations in Safari for now - some problems reported but not reproducible
        global $is_safari;
        if ($is_safari)
            return false;

        //Disable all animations for mobile devices
        if (mo_is_mobile()) {
            return false;
        }

        return true;
    }
}

if (!function_exists('mo_is_mobile')) {

    function mo_is_mobile() {

        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        if (strstr($user_agent, 'iPhone') || strstr($user_agent, 'iPod') || strstr($user_agent, 'iPad') || strstr($user_agent, 'Android') || strstr($user_agent, 'IEMobile') || strstr($user_agent, 'blackberry'))
            return true;
        return false;
    }
}

if (!function_exists('mo_site_description')) {

    /* TODO: Support for site description */
    function mo_site_description() {
        $display_desc = mo_get_theme_option('mo_display_site_desc') ? true : false;
        $display_desc = false; // no support for description now
        if ($display_desc) {
            echo '<div id="site-description"><span>' . bloginfo('description') . '</span></div>';
        }
    }
}
if (!function_exists('mo_get_content_class')) {

    function mo_get_content_class() {
        $classes = array();
        $classes = apply_filters('mo_content_class', $classes);
        $style = '';
        foreach ($classes as $class) {
            $style .= $class . ' ';
        }
        return $style;
    }
}

if (!function_exists('mo_get_cached_value')) {
    function mo_get_cached_value($key) {
        global $theme_cache;

        if (array_key_exists($key, $theme_cache))
            return $theme_cache[$key];

        return null;
    }
}

if (!function_exists('mo_set_cached_value')) {

    function mo_set_cached_value($key, $value) {
        global $theme_cache;

        $theme_cache[$key] = $value;
        return $value;
    }
}

if (!function_exists('mo_get_theme_option')) {

    function mo_get_theme_option($option_id, $default = null, $single = true) {
        global $mo_theme;
        global $options_cache;

        if (array_key_exists($option_id, $options_cache))
            return $options_cache[$option_id];

        $option_value = $mo_theme->get_theme_option($option_id, $default, $single);
        $options_cache[$option_id] = $option_value; //store in cache for further use
        return $option_value;
    }
}

if (!function_exists('mo_get_image_size')) {

    function mo_get_image_size($wp_thumb_name) {
        global $mo_theme;

        $image_size_key = 'current_image_size';
        $image_size_attr_key = 'current_image_size_attr';

        if (mo_get_cached_value($image_size_key) == $wp_thumb_name)
            return mo_get_cached_value($image_size_attr_key);

        mo_set_cached_value($image_size_key, $wp_thumb_name); // set current image size
        mo_set_cached_value($image_size_attr_key, array()); // reset the old value

        $image_sizes = $mo_theme->get_image_sizes();
        if (array_key_exists($wp_thumb_name, $image_sizes)) {
            $image_size = $image_sizes[$wp_thumb_name];
            $current_image_size_attr = array('width' => $image_size[0], 'height' => $image_size[1]);
            mo_set_cached_value($image_size_attr_key, $current_image_size_attr);
            return $current_image_size_attr;
        }
        return null;
    }
}

if (!function_exists('mo_get_wp_thumb_name')) {

    function mo_get_wp_thumb_name($easy_name, $default = 'medium') {
        global $mo_theme;

        $image_size = null;

        $easy_name_map = $mo_theme->get_easy_image_name_map();

        if (array_key_exists($easy_name, $easy_name_map)) {
            $image_size = $easy_name_map [$easy_name];
        }
        elseif ($default != null)
            $image_size = $easy_name_map [$default];
        return $image_size;
    }
}

if (!function_exists('mo_get_image_size_array')) {

    function mo_get_image_size_array($easy_thumb_name, $default = 'medium') {
        $wp_thumb_name = mo_get_wp_thumb_name($easy_thumb_name, $default);

        $image_size = mo_get_image_size($wp_thumb_name);

        return $image_size;
    }
}

if (!function_exists('mo_footer_content')) {

    function mo_footer_content() {

        // Default footer text
        $site_link = '<a class="site-link" href="' . home_url() . '" title="' . esc_attr(get_bloginfo('name')) . '" rel="home"><span>' . get_bloginfo('name') . '</span></a>';
        $wp_link = '<a class="wp-link" href="http://wordpress.org" title="' . esc_attr__('Powered by WordPress', 'mo_theme') . '"><span>' . __('WordPress', 'mo_theme') . '</span></a>';
        if (function_exists('wp_get_theme')) {
            $my_theme = wp_get_theme();
            $theme_link = '<a class="theme-link" href="' . esc_url($my_theme->ThemeURI) . '" title="' . esc_attr($my_theme->Name) . '"><span>' . esc_attr($my_theme->Name) . '</span></a>';
        }
        else {
            $theme_data = get_theme_data(trailingslashit(get_template_directory()) . 'style.css');
            $theme_link = '<a class="theme-link" href="' . esc_url($theme_data['URI']) . '" title="' . esc_attr($theme_data['Name']) . '"><span>' . esc_attr($theme_data['Name']) . '</span></a>';
        }

        $footer_text = __('Copyright &#169; ', 'mo_theme') . date(__('Y', 'mo_theme')) . ' ' . $site_link . __('. Powered by ', 'mo_theme') . $wp_link . __(' and ', 'mo_theme') . $theme_link;
        $footer_text = '<div id="footer-bottom-text">' . mo_get_theme_option('mo_footer_insert', $footer_text) . '</div>';
        echo do_shortcode($footer_text);
    }
}


if (!function_exists('mo_get_column_style')) {
    /* Return the css class name to help achieve the number of columns specified */

    function mo_get_column_style($column_count = 2) {
        $style_class = '';
        switch ($column_count) {
            case 2:
                $style_class = "sixcol";
                break;
            case 3:
                $style_class = "fourcol";
                break;
            case 4;
                $style_class = "threecol";
        }
        return $style_class;
    }
}

if (!function_exists('mo_is_wide_page_layout')) {

    function mo_is_wide_page_layout() {
        return (mo_is_home_page_layout() || is_page_template('template-full-width.php') || is_singular('page_section'));
    }
}

if (!function_exists('mo_is_home_page_layout')) {

    function mo_is_home_page_layout() {
        return (is_page_template('template-advanced-home.php') || is_page_template('template-single-page-site.php'));
    }
}

if (!function_exists('mo_truncate_string')) {
    /* Original PHP code by Chirp Internet: www.chirp.com.au
    http://www.the-art-of-web.com/php/truncate/ */

    function mo_truncate_string($string, $limit, $strip_tags = true, $strip_shortcodes = true, $break = " ", $pad = "...") {
        if ($strip_shortcodes)
            $string = strip_shortcodes($string);

        if ($strip_tags)
            $string = strip_tags($string, '<p>'); // retain the p tag for formatting


        // return with no change if string is shorter than $limit
        if (strlen($string) <= $limit)
            return $string;
        elseif ($limit === 0 || $limit == '0')
            return '';


        // is $break present between $limit and the end of the string?
        if (false !== ($breakpoint = strpos($string, $break, $limit))) {
            if ($breakpoint < strlen($string) - 1) {
                $string = substr($string, 0, $breakpoint) . $pad;
            }
        }

        return $string;
    }
}

if (!function_exists('mo_build_nav_menu_one_page_site')) {

    function mo_build_nav_menu_one_page_site($menu_type = 'primary') {
        $single_page = mo_get_theme_option('mo_single_page_site');
        if (empty($single_page)) {
            return;
        }

        echo '<div id="' . $menu_type . '-menu" class="' . ($menu_type != 'mobile' ? 'dropdown-menu-wrap ' : '') . 'clearfix">';
        echo '<ul class="menu clearfix">';

        mo_display_home_page_nav();

        $page_sections = mo_get_theme_option('mo_page_section_select_for_one_page');

        if (is_front_page())
            mo_display_page_sections_nav($page_sections);
        else
            mo_display_page_sections_nav($page_sections, get_home_url()); //populate internal links to home page in external pages

        $pages = mo_get_theme_option('mo_page_nav_select_for_one_page');

        mo_display_external_pages_nav($pages); //display links to external pages

        echo '</ul>';
        echo '</div>';
    }
}

if (!function_exists('mo_build_nav_menu_for_one_page_template')) {

    /* No dropdowns for one page site template pages even if the wp menu is configured that way.  Assuming one page sites
    do not worry about dropdowns at least for alternate one pages. Can always navigate to home page to get the dropdown */
    function mo_build_nav_menu_for_one_page_template($menu_type = 'primary') {
        // No building menu unless it is a single page template
        if (!is_page_template('template-single-page-site.php')) {
            return;
        }
        // If it is home page, will handle menu in a separate function through theme options
        if (is_front_page())
            return;

        echo '<div id="' . $menu_type . '-menu" class="' . ($menu_type != 'mobile' ? 'dropdown-menu-wrap ' : '') . 'clearfix">';
        echo '<ul class="menu clearfix">';

        mo_display_home_page_nav();

        $current_page_id = get_the_ID();
        $current_page_title = get_the_title($current_page_id);
        $current_page_url = get_permalink($current_page_id);

        // Display the link to current single page template item before you populate the internal links - establish context for internal links
        echo '<li class="menu-item external active">';
        echo '<a href="' . $current_page_url . '" title="' . $current_page_title . '">' . $current_page_title . '</a>';
        echo '</li>';

        // Make the single page templates to have independent page section - they will NOT point to internal links of home page
        $page_sections = get_post_meta($current_page_id, 'mo_page_section_select_for_one_page', true);

        mo_display_page_sections_nav($page_sections);

        // Make the single page templates to have separate page links - avoids having duplicate links in the menu since the
        // current page menu item is already populated above as second item after home. The home pages have external links to
        // other single page template pages like the current one in their page links collection.
        $pages = get_post_meta($current_page_id, 'mo_page_nav_select_for_one_page', true);

        mo_display_external_pages_nav($pages);

        echo '</ul>';
        echo '</div>';
    }
}

if (!function_exists('mo_display_home_page_nav')) {

    function mo_display_home_page_nav() {

        echo '<li class="menu-item external' . (is_front_page() ? ' active' : '') . '">';
        echo '<a href="' . get_home_url() . '" title="' . get_bloginfo('name') . '">' . __('Home', 'mo_theme') . '</a>';
        echo '</li>';
    }

}

if (!function_exists('mo_display_external_pages_nav')) {
    /**
     * @param $pages
     */
    function mo_display_external_pages_nav($pages) {
        $current_page_id = get_the_ID();
        if (!empty($pages)) {
            foreach ($pages as $page_id) {
                $page_title = get_the_title($page_id);
                if (!empty($page_id)) {
                    echo '<li class="menu-item external' . (($current_page_id == $page_id) ? ' active' : '') . '">';
                    echo '<a href="' . get_permalink($page_id) . '" title="' . $page_title . '">' . $page_title . '</a>';
                    echo '</li>';
                }
            }
        }
    }
}

if (!function_exists('mo_display_page_sections_nav')) {
    function mo_display_page_sections_nav($page_sections, $page_url = '') {
        $page_url_prefix = '';
        if (!empty($page_url))
            $page_url_prefix = $page_url . '/'; // useful only in the case of external pages like blog
        $query = new WP_Query(array('post_type' => 'page_section', 'post__in' => $page_sections, 'posts_per_page' => -1, 'order' => 'ASC', 'orderby' => 'menu_order', 'post_status' => 'publish'));
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post = get_post();
                echo '<li class="menu-item">';
                echo '<a href="' . $page_url_prefix . '#' . $post->post_name . '" title="' . $post->post_title . '">' . $post->post_title . '</a>';
                echo '</li>';
            }
        }
        else {
            // no page sections created yet
        }
        /* Restore original Post Data */
        wp_reset_postdata();
    }
}

if (!function_exists('mo_display_portfolio_content')) {


    function mo_display_portfolio_content($args) {
        global $mo_theme;

        $mo_theme->set_context('loop', 'portfolio'); // tells the thumbnail functions to prepare lightbox constructs for the image

        $paged = (get_query_var('paged')) ? get_query_var('paged') : 0; // Do NOT paginate

        $query_args = array('post_type' => 'portfolio', 'posts_per_page' => $args['posts_per_page'], 'filterable' => $args['filterable'], 'paged' => $paged);

        $term = get_term_by('slug', get_query_var('term'), 'portfolio_category');

        if ($term)
            $query_args['portfolio_category'] = $term->slug;

        $args['query_args'] = $query_args;

        mo_display_portfolio_content_grid_style($args);

        $mo_theme->set_context('loop', null); //reset it
    }
}

if (!function_exists('mo_display_home_portfolio_content')) {

    function mo_display_home_portfolio_content($args) {
        global $mo_theme;

        $mo_theme->set_context('loop', 'portfolio'); // tells the thumbnail functions to prepare lightbox constructs for the image

        /* Extract the array to allow easy use of variables. */
        extract($args);

        $style_class = mo_get_column_style($number_of_columns);
        ?>

        <div class="hfeed">

            <?php

            $loop = new WP_Query(array('post_type' => 'portfolio', 'posts_per_page' => $posts_per_page));

            if ($loop->have_posts()) :

                echo mo_get_portfolio_categories_filter();

                echo '<ul id="portfolio-items" class="image-grid">';

                while ($loop->have_posts()) : $loop->the_post();

                    $style = $style_class . ' portfolio-item clearfix'; // no margin or spacing between portfolio items
                    $terms = get_the_terms(get_the_ID(), 'portfolio_category');
                    if (!empty($terms)) {
                        foreach ($terms as $term) {
                            $style .= ' term-' . $term->term_id;
                        }
                    }
                    ?>
                    <li data-id="id-<?php the_ID(); ?>" class="<?php echo $style; ?>">

                        <div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

                            <?php $thumbnail_exists = mo_thumbnail(array('image_size' => $image_size, 'wrapper' => true, 'size' => 'full', 'taxonamy' => 'portfolio_category')); ?>

                        </div>
                        <!-- .hentry -->

                    </li> <!--isotope element -->

                <?php endwhile; ?>

                </ul> <!-- Isotope items -->

            <?php else : ?>

                <?php get_template_part('loop-error'); // Loads the loop-error.php template.                  ?>

            <?php endif; ?>

        </div> <!-- .hfeed -->

        <?php wp_reset_postdata(); ?>

        <?php

        $mo_theme->set_context('loop', null); //reset it
    }

}

if (!function_exists('mo_get_home_portfolio_content')) {
    function mo_get_home_portfolio_content($args) {
        global $mo_theme;

        $output = '';

        $mo_theme->set_context('loop', 'portfolio'); // tells the thumbnail functions to prepare lightbox constructs for the image

        /* Extract the array to allow easy use of variables. */
        extract($args);

        $style_class = mo_get_column_style($number_of_columns);

        $output .= '<div class="hfeed">';

        $loop = new WP_Query(array('post_type' => 'portfolio', 'posts_per_page' => $posts_per_page));

        if ($loop->have_posts()) :

            $output .= mo_get_portfolio_categories_filter();

            $output .= '<ul id="portfolio-items" class="image-grid">';

            while ($loop->have_posts()) : $loop->the_post();

                $style = $style_class . ' portfolio-item clearfix'; // no margin or spacing between portfolio items
                $terms = get_the_terms(get_the_ID(), 'portfolio_category');
                if (!empty($terms)) {
                    foreach ($terms as $term) {
                        $style .= ' term-' . $term->term_id;
                    }
                }

                $output .= '<li data-id="id-' . get_the_ID() . '" class="' . $style . '">';

                $output .= '<div id="post-' . get_the_ID() . '" class="' . join(' ', get_post_class()) . '">';

                $output .= mo_get_thumbnail(array('image_size' => $image_size, 'wrapper' => true, 'size' => 'full', 'taxonamy' => 'portfolio_category'));

                $output .= '</div><!-- .hentry -->';

                $output .= '</li> <!--isotope element -->';

            endwhile;

            $output .= '</ul> <!-- Isotope items -->';

        else :
            get_template_part('loop-error'); // Loads the loop-error.php template.
        endif;

        $output .= '</div> <!-- .hfeed -->';

        wp_reset_postdata();

        $mo_theme->set_context('loop', null); //reset it

        return $output;
    }
}

if (!function_exists('mo_to_boolean')) {

    /*
    * Converting string to boolean is a big one in PHP
    */

    function mo_to_boolean($value) {
        if (!isset($value))
            return false;
        if ($value == 'true' || $value == '1')
            $value = true;
        elseif ($value == 'false' || $value == '0')
            $value = false;
        return (bool)$value; // Make sure you do not touch the value if the value is not a string
    }
}

if (!function_exists('mo_populate_top_area')) {

    function mo_populate_top_area($post_id = NULL) {
        $slider_manager = MO_Slider_Manager::getInstance();
        if (mo_is_home_page_layout()) {
            $slider_manager->display_slider_area();
            return;
        }

        if (is_home() && mo_get_theme_option('mo_remove_homepage_tagline'))
            return;

        if (is_singular(array('post', 'page', 'portfolio'))) {
            $custom_heading = mo_get_custom_heading();
            if (!empty($custom_heading)) {
                echo '<div id="custom-title-area">';
                $wide_heading_layout = get_post_meta(get_queried_object_id(), 'mo_wide_heading_layout', true);
                if (empty($wide_heading_layout))
                    echo '<div class="inner">';
                else
                    echo '<div class="wide">';
                echo do_shortcode($custom_heading);
                echo '</div>';
                echo '</div> <!-- custom-title-area -->';
                return;
            }
        }

        echo '<div id="title-area" class="clearfix">';
        echo '<div class="inner">';
        mo_populate_tagline();
        echo '</div>';
        echo '</div> <!-- title-area -->';
    }


}
if (!function_exists('mo_populate_tagline')) {
    function mo_populate_tagline() {

        /* Default tagline for blog */
        $tagline = mo_get_theme_option('mo_blog_tagline', __('Blog', 'mo_theme'));

        $default_homepage_title = get_bloginfo('name') . __(' Home', 'mo_theme');
        $homepage_tagline = mo_get_theme_option('mo_homepage_tagline', $default_homepage_title);

        if (is_attachment()) {
            echo '<h1>' . __('Media', 'mo_theme') . '</h1>';
        }
        elseif (is_home()) {
            echo '<h2 class="tagline">' . $homepage_tagline . '</h2>';
        }
        elseif (is_singular('post')) {
            echo '<h2 class="tagline">' . $tagline . '</h2>';
        }
        elseif (is_archive() || is_search()) {
            get_template_part('loop-meta'); // Loads the loop-meta.php template.
        }
        elseif (is_404()) {
            echo '<h1>' . __('404 Not Found', 'mo_theme') . '<h1>';
        }
        else {
            echo mo_get_entry_title(); // populate entry title for page and custom post types like portfolio type
        }
        $description = get_post_meta(get_queried_object_id(), 'mo_description', true);
        if (!empty ($description)) {
            echo '<div class="post-description">';
            echo '<p>' . $description . '</p>';
            echo '</div>';
        }
    }
}

if (!function_exists('mo_get_custom_heading')) {
    function mo_get_custom_heading() {
        $output = '';
        $custom_heading = __(get_post_meta(get_queried_object_id(), 'mo_custom_heading_content', true), 'mo_theme'); // For qtranslate
        if (!empty ($custom_heading)) {
            $output .= $custom_heading;
        }
        return $output;
    }
}

if (!function_exists('mo_portfolio_page')) {
    /**
     * Check if this is a portfolio page
     */
    function mo_portfolio_page() {

        if (is_page_template('template-portfolio-2c-full-width.php')
            || is_page_template('template-portfolio-2c.php')
            || is_page_template('template-portfolio-3c-full-width.php')
            || is_page_template('template-portfolio-3c.php')
            || is_page_template('template-portfolio-4c-full-width.php')
            || is_page_template('template-portfolio-4c.php')
        )
            return true;

        return false;
    }

}

if (!function_exists('mo_is_portfolio_context')) {
    /**
     * Check if this is a portfolio page
     *
     */
    function mo_is_portfolio_context() {

        global $mo_theme;

        $context = $mo_theme->get_context('loop');

        if ($context == 'portfolio')
            return true;

        return false;
    }
}

if (!function_exists('mo_display_contact_info')) {

    function mo_display_contact_info() {
        $phone_number = mo_get_theme_option('mo_phone_number', '');
        $email = mo_get_theme_option('mo_email_address', '');

        if (!empty ($phone_number) || !empty($email)) {
            $output = '<div id="contact-header">';
            $output .= '<ul>';
            if (!empty($phone_number)) {
                $output .= '<li><span class="icon-iphone"></span>' . $phone_number . '</li>';
            }
            if (!empty($email)) {
                $output .= '<li><span class="icon-email"></span>' . $email . '</li>';
            }
            $output .= '</ul>';
            $output .= '</div>';
            echo $output;
        }

    }
}

if (!function_exists('mo_display_app_button_or_socials')) {

    function mo_display_app_button_or_socials() {

        $disable_get_app_button = mo_get_theme_option('mo_disable_get_app_button');
        if ($disable_get_app_button) {
            mo_populate_social_icons();
            return;
        }
        $button_url = mo_get_theme_option('mo_get_app_button_url', '#');
        $button_text = mo_get_theme_option('mo_get_app_button_text', __('Get this App', 'mo_theme'));
        echo '<a id="get-app-button" class="button default get-app" href="' . $button_url . '"><span>' . $button_text . '</span></a>';
    }
}

if (!function_exists('mo_populate_social_icons')) {
    /**
     * Populate top social icons in header
     */
    function mo_populate_social_icons() {

        $hide_socials = mo_get_theme_option('mo_hide_socials');

        if ($hide_socials)
            return;

        $facebook_url = mo_get_theme_option('mo_facebook_url', '');
        $twitter_url = mo_get_theme_option('mo_twitter_url', '');
        $linkedin_url = mo_get_theme_option('mo_linkedin_url', '');
        $flickr_url = mo_get_theme_option('mo_flickr_url', '');
        $googleplus_url = mo_get_theme_option('mo_googleplus_url', '');
        $dribbble_url = mo_get_theme_option('mo_dribbble_url', '');
        $behance_url = mo_get_theme_option('mo_behance_url', '');
        $youtube_url = mo_get_theme_option('mo_youtube_url', '');
        $vimeo_url = mo_get_theme_option('mo_vimeo_url', '');
        $pinterest_url = mo_get_theme_option('mo_pinterest_url', '');

        $display_rss_feed_url = mo_get_theme_option('mo_display_rss_feed_url');
        if ($display_rss_feed_url)
            $rss_feed_url = get_bloginfo('rss2_url');
        ?>
        <div class="social-container">
            <ul>
                <?php
                if (!empty($facebook_url))
                    echo '<li class="facebook"><a title="Follow us on Facebook" href="' . $facebook_url . '">Facebook</a></li>';
                if (!empty($googleplus_url))
                    echo '<li class="googleplus"><a title="Follow us on Google Plus" href="' . $googleplus_url . '">Google Plus</a></li>';
                if (!empty($flickr_url))
                    echo '<li class="flickr"><a title="Flickr Profile" href="' . $flickr_url . '">Flickr</a></li>';
                if (!empty($twitter_url))
                    echo '<li class="twitter"><a title="Subscribe to our Twitter feed" href="' . $twitter_url . '">Twitter</a></li>';
                if (!empty($linkedin_url))
                    echo '<li class="linkedin"><a title="Connect with us on LinkedIn" href="' . $linkedin_url . '">LinkedIn</a></li>';
                if (!empty($behance_url))
                    echo '<li class="behance"><a title="Check out our posts on Behance" href="' . $behance_url . '">Behance</a></li>';
                if (!empty($vimeo_url))
                    echo '<li class="vimeo"><a title="Check out our videos on Vimeo" href="' . $vimeo_url . '">Vimeo</a></li>';
                if (!empty($youtube_url))
                    echo '<li class="youtube"><a title="Subscribe to our YouTube channel" href="' . $youtube_url . '">YouTube</a></li>';
                if (!empty($pinterest_url))
                    echo '<li class="pinterest"><a title="Subscribe to our Pinterest feed" href="' . $pinterest_url . '">Pinterest</a></li>';
                if (!empty($dribbble_url))
                    echo '<li class="dribbble"><a title="Check out our Dribbble shots" href="' . $dribbble_url . '">Dribbble</a></li>';

                if (!empty($rss_feed_url))
                    echo '<li class="rss-feed"><a class="rssfeed" title="Subscribe to our RSS Feed" href="' . $rss_feed_url . '">RSS</a></li>';
                ?>
            </ul>
        </div>
    <?php
    }
}

if (!function_exists('mo_get_thumbnail_args_for_singular')) {

    function mo_get_thumbnail_args_for_singular() {
        $layout_manager = MO_LayoutManager::getInstance();

        /* Set the default arguments. */
        $args = array('wrapper' => true,
            'size' => 'full',
            'before_html' => '<span>',
            'after_html' => '</span>',
            'image_scan' => false, /* Do not scan content for images - do not want to duplicate the image in content. Use featured image only */
            'attachment' => false /* Show only featured images as post image on the top */
        );

        $retain_image_height = mo_get_theme_option('mo_retain_image_height');

        if ($layout_manager->is_full_width_layout()) {
            $args['image_size'] = 'full';
            $args['image_class'] = 'featured thumbnail full-1c';
        }
        else {
            $args['image_size'] = 'large';
            $args['image_class'] = 'featured thumbnail full';
        }

        if ($retain_image_height) {
            if ($layout_manager->is_full_width_layout())
                $args['image_size'] = array('width' => 1140, 'height' => 0);
            else
                $args['image_size'] = array('width' => 820, 'height' => 0);
        }

        return $args;
    }
}

if (!function_exists('mo_is_youtube')) {

    function mo_is_youtube($video_url) {
        if (strpos($video_url, "youtube.com") || strpos($video_url, "youtu.be"))
            return true;
        else return false;
    }
}

if (!function_exists('mo_is_vimeo')) {
    function mo_is_vimeo($video_url) {
        if (strpos($video_url, "vimeo.com"))
            return true;
        else
            return false;
    }
}

if (!function_exists('mo_get_youtube_id')) {

    function mo_get_youtube_id($video_url) {
        preg_match('#(?:https?(?:a|vh?)?://)?youtu\.be/([A-Za-z0-9\-_]+)#', $video_url, $matches);
        return $matches[1];
    }
}

if (!function_exists('mo_get_vimeo_id')) {

    function mo_get_vimeo_id($video_url) {
        preg_match('#(?:http://)?(?:www\.)?vimeo\.com/([A-Za-z0-9\-_]+)#', $video_url, $matches);
        return $matches[1];
    }
}
