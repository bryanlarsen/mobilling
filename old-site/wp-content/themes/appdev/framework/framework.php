<?php

/**
 * Main class for the Livemesh theme framework which does the orchestration.
 *
 * @package Livemesh_Framework
 */
class MO_Framework {

    private $theme_options;
    private $theme_extender;
    private $layout_manager;
    private $sidebar_manager;
    private $context;
    private $image_sizes;

    /* Constructor for the class */

    function __construct() {

        add_action('after_setup_theme', array(&$this, 'define_constants'), 8);

        add_action('after_setup_theme', array(&$this, 'init_option_tree'), 9);

        add_action('after_setup_theme', array(&$this, 'load_functions'), 10);

        add_action('after_setup_theme', array(&$this, 'initialize_theme'), 11);

        add_action('after_setup_theme', array(&$this, 'i18n'), 12);
    }

    function init_option_tree() {
        /**
         * Option Tree Settings
         * Optional: set 'ot_show_pages' filter to false.
         * This will hide the settings & documentation pages.
         */
        add_filter('ot_show_pages', '__return_true');
        //add_filter('ot_show_pages', '__return_false');

        /**
         * Optional: set 'ot_show_new_layout' filter to false.
         * This will hide the "New Layout" section on the Theme Options page.
         */
        add_filter('ot_show_new_layout', '__return_true');

        /**
         * Required: set 'ot_theme_mode' filter to true.
         */
        add_filter('ot_theme_mode', '__return_true');

        /* Do not show the options import. The settings data import will be shown though. */
        add_filter('ot_show_settings_import', '__return_false');

        /* Do not show the options export. The settings data export will be shown though. */
        add_filter('ot_show_settings_export', '__return_false');

        /* Do not show documentation for option tree */
        add_filter('ot_show_docs', '__return_false');

        /* Do not show the options UI which enables users to define new options */
        add_filter('ot_show_options_ui', '__return_false');

        /**
         * Required: include OptionTree.
         */
        require_once(MO_FRAMEWORK_DIR . '/option-tree/ot-loader.php');


        /**
         * Theme Options - if file exists, loads the options
         */
        include_once(MO_FRAMEWORK_DIR . '/extensions/theme-options.php');

    }

    function i18n() {

        // Make theme available for translation
        // Translations can be filed in the /languages/ directory
        load_theme_textdomain('mo_theme', get_template_directory() . '/languages');

        $locale = get_locale();
        $locale_file = get_template_directory() . "/languages/$locale.php";
        if (is_readable($locale_file))
            require_once($locale_file);

    }


    /**
     * Define framework constants
     */
    function define_constants() {

        /* Sets the path to the parent theme directory. */
        define('MO_THEME_DIR', get_template_directory());

        /* Sets the path to the parent theme directory URI. */
        define('MO_THEME_URL', get_template_directory_uri());

        /* Sets the path to the core Livemesh Framework directory. */
        define('MO_FRAMEWORK_DIR', get_template_directory() . '/framework');

        /* Sets the path to the theme scripts directory. */
        define('MO_SCRIPTS_URL', MO_THEME_URL . '/js');

        /* Sets the path to the theme third party library scripts directory. */
        define('MO_SCRIPTS_LIB_URL', MO_THEME_URL . '/js/libs');

        /* Sets the path to the theme images directory. */
        define('MO_IMAGES_URL', MO_THEME_URL . '/images');
    }

    /**
     * All the context related functions. An extensible array of key value pairs
     */
    function has_context($context_key) {
        return (isset($this->context[$context_key]));
    }

    function set_context($context_key, $context_value) {
        $this->context[$context_key] = $context_value;
    }

    function get_context($context_key) {
        if ($this->has_context($context_key))
            return $this->context[$context_key];
        return false;
    }

    function get_easy_image_name_map() {
        $easy_name_map = array('mini' => 'mini-thumb', 'small' => 'small-thumb', 'medium' => 'medium-thumb', 'large' => 'large-thumb', 'full' => 'slider-thumb', 'square' => 'square-thumb');
        return $easy_name_map;
    }

    function get_image_sizes() {

        if (!isset($this->image_sizes)) {

            $this->image_sizes = array(
                'mini-thumb' => array(90, 65),
                'small-thumb' => array(295, 220),
                'medium-thumb' => array(550, 400),
                'large-thumb' => array(820, 400),
                'slider-thumb' => array(1140, 500),
                'square-thumb' => array(300, 300)
            );

        }
        return $this->image_sizes;
    }

    /**
     * Declare theme options global var for reuse everywhere - reduces db calls
     */
    function init_theme_options() {
        $this->theme_options = get_option('option_tree');
    }

    function get_theme_option($option, $default = null, $single = true) {
        /* Allow posts to override global options. Quite powerful. Use get_queried_object_id
        since we are interested in only the ID of current post/page being rendered. */
        $option_value = get_post_meta(get_queried_object_id(), $option, $single);

        if (!$option_value) {

            if (function_exists('ot_get_option')) {
                $option_value = ot_get_option($option, $default);
            }
            else {
                $option_value = get_option($option);
            }
        }

        if (isset($option_value))
            return $option_value;

        return $default;
    }

    /**
     * Include all the required functions
     *
     */
    function load_functions() {


        /* Load the utility functions. */

        require_once(MO_FRAMEWORK_DIR . '/extensions/framework-extender.php');
        include_once(MO_FRAMEWORK_DIR . '/extensions/init-options.php');
        require_once(MO_FRAMEWORK_DIR . '/extensions/loop-pagination.php');
        include_once(MO_FRAMEWORK_DIR . '/extensions/get-the-image.php');
        include_once(MO_FRAMEWORK_DIR . '/extensions/aq_resizer.php');
        include_once(MO_FRAMEWORK_DIR . '/extensions/class-tgm-plugin-activation.php');
        /* The stylizer generates css based on options chosen by the user in theme options panel */
        include_once(MO_FRAMEWORK_DIR . '/extensions/stylizer.php');

        require_once(MO_FRAMEWORK_DIR . '/functions/utility-functions.php');
        require_once(MO_FRAMEWORK_DIR . '/functions/post-functions.php');
        require_once(MO_FRAMEWORK_DIR . '/functions/commenting.php');
        require_once(MO_FRAMEWORK_DIR . '/functions/thumbnail-functions.php');
        require_once(MO_FRAMEWORK_DIR . '/functions/blog-content.php');
        require_once(MO_FRAMEWORK_DIR . '/functions/breadcrumbs.php');

        require_once(MO_FRAMEWORK_DIR . '/partials/sitemap.php');

        require_once(MO_FRAMEWORK_DIR . '/presentation/layout-manager.php');
        require_once(MO_FRAMEWORK_DIR . '/presentation/sidebar-manager.php');
        require_once(MO_FRAMEWORK_DIR . '/presentation/slider-manager.php');
        require_once(MO_FRAMEWORK_DIR . '/presentation/metabox-manager.php');


        $widgets_path = MO_FRAMEWORK_DIR . '/widgets/';

        require_once($widgets_path . 'mo-widget.php');

        include_once($widgets_path . 'mo-flickr-widget.php');
        include_once($widgets_path . 'mo-popular-posts-widget.php');
        include_once($widgets_path . 'mo-recent-posts-widget.php');
        include_once($widgets_path . 'mo-twitter-widget.php');
        include_once($widgets_path . 'mo-author-widget.php');
        include_once($widgets_path . 'mo-featured-posts-widget.php');
        include_once($widgets_path . 'mo-related-posts-widget.php');
        include_once($widgets_path . 'mo-advertisement-125-widget.php');
        include_once($widgets_path . 'mo-social-networks-widget.php');
        include_once($widgets_path . 'mo-contact-info-widget.php');

        $shortcodes_path = MO_FRAMEWORK_DIR . '/shortcodes/';

        include_once($shortcodes_path . 'typography-shortcodes.php');
        include_once($shortcodes_path . 'video-shortcodes.php');
        include_once($shortcodes_path . 'column-shortcodes.php');
        include_once($shortcodes_path . 'divider-shortcodes.php');
        include_once($shortcodes_path . 'box-shortcodes.php');
        include_once($shortcodes_path . 'location-shortcodes.php');
        include_once($shortcodes_path . 'image-shortcodes.php');
        include_once($shortcodes_path . 'tabs-shortcodes.php');
        include_once($shortcodes_path . 'posts-shortcodes.php');
        include_once($shortcodes_path . 'button-shortcodes.php');
        include_once($shortcodes_path . 'contact-shortcodes.php');
        include_once($shortcodes_path . 'social-shortcodes.php');
        include_once($shortcodes_path . 'protected-content-shortcodes.php');
        include_once($shortcodes_path . 'slider-shortcodes.php');
        include_once($shortcodes_path . 'miscellaneous-shortcodes.php');

        /* Load the custom functions first to help override the default behavior of the theme
        and to help push fixes, customizations into this file */
        include_once(MO_THEME_DIR . '/custom/custom-functions.php');

    }

    function initialize_theme() {

        $this->init_theme_options();

        $this->register_custom_post_types();

        $this->enable_theme_features();

        /* Initialize all the helper classes */
        $this->layout_manager = MO_LayoutManager::getInstance();
        $this->layout_manager->initialize();

        $this->sidebar_manager = MO_SidebarManager::getInstance();
        $this->sidebar_manager->initialize();

        $this->slider_manager = MO_Slider_Manager::getInstance();
        $this->slider_manager->initialize();

        $this->theme_extender = MO_Framework_Extender::getInstance();
        $this->theme_extender->initialize();

        $this->context = array(); // Will be set by pages

        $this->add_actions_filters();

        $this->setup_admin_features();
    }

    /**
     * Enable Admin Features.
     */
    function setup_admin_features() {

        /* Sets the path to the directory containing admin enhancements. */
        define('MO_ADMIN_DIR', get_template_directory() . '/framework/admin');

        if (is_admin()) {
            //shortcode helper plugin
            require_once(MO_ADMIN_DIR . '/tinymce/tinymce.php');

            require_once(MO_ADMIN_DIR . '/slider-admin.php');
            $slider_admin = MO_Slider_Admin::getInstance();
            $slider_admin->initialize();

            require_once(MO_ADMIN_DIR . '/portfolio-admin.php');
            $portfolio_admin = MO_Portfolio_Admin::getInstance();
            $portfolio_admin->initialize();

            // Call now to initialize shortcode helper button on edit window
            $tinymce_button = new Shortcode_Helper ();
        }
    }

    function register_custom_post_types() {

        $this->register_portfolio_type();

        $this->register_page_section_type();

        $this->register_showcase_slide_type();
    }

    function register_portfolio_type() {

        $labels = array(
            'name' => _x('Portfolio', 'portfolio name', 'mo_theme'),
            'singular_name' => _x('Portfolio Entry', 'portfolio type singular name', 'mo_theme'),
            'add_new' => _x('Add New', 'portfolio', 'mo_theme'),
            'add_new_item' => __('Add New Portfolio Entry', 'mo_theme'),
            'edit_item' => __('Edit Portfolio Entry', 'mo_theme'),
            'new_item' => __('New Portfolio Entry', 'mo_theme'),
            'view_item' => __('View Portfolio Entry', 'mo_theme'),
            'search_items' => __('Search Portfolio Entries', 'mo_theme'),
            'not_found' => __('No Portfolio Entries Found', 'mo_theme'),
            'not_found_in_trash' => __('No Portfolio Entries Found in Trash', 'mo_theme'),
            'parent_item_colon' => ''
        );

        register_post_type('portfolio', array('labels' => $labels,

                'public' => true,
                'show_ui' => true,
                'show_in_menu' => true,
                'capability_type' => 'post',
                'hierarchical' => false,
                'publicly_queryable' => true,
                'query_var' => true,
                'exclude_from_search' => false,
                'rewrite' => array('slug' => 'portfolio'),
                'taxonomies' => array('portfolio_category'),
                'show_in_nav_menus' => false,
                'menu_position' => 20,
                'menu_icon' => MO_THEME_URL . '/images/admin/portfolio.png',
                'supports' => array('title', 'editor', 'thumbnail', 'comments', 'excerpt', 'custom-fields')
            )
        );

        register_taxonomy('portfolio_category', array('portfolio'), array('hierarchical' => true,
            'label' => __('Portfolio Categories', 'mo_theme'),
            'singular_label' => __('Portfolio Category', 'mo_theme'),
            'rewrite' => true,
            'query_var' => true
        ));
    }

    function register_page_section_type() {

        $labels = array(
            'name' => _x('Page Section', 'page section general name', 'mo_theme'),
            'singular_name' => _x('Page Section', 'page section singular name', 'mo_theme'),
            'add_new' => _x('Add New', 'page ', 'mo_theme'),
            'add_new_item' => __('Add New Page Section', 'mo_theme'),
            'edit_item' => __('Edit Page Section', 'mo_theme'),
            'new_item' => __('New Page Section', 'mo_theme'),
            'view_item' => __('View Page Section', 'mo_theme'),
            'search_items' => __('Search Page Sections', 'mo_theme'),
            'not_found' => __('No Page Sections Found', 'mo_theme'),
            'not_found_in_trash' => __('No Page Sections Found in Trash', 'mo_theme'),
            'parent_item_colon' => ''
        );

        register_post_type('page_section', array('labels' => $labels,
                'description' => __('A custom post type which represents a section like about, work, services, team etc. part of a typical single page site. Can be made up of one or more segments.', 'mo_theme'),
                'public' => true,
                'show_ui' => true,
                'show_in_menu' => true,
                'capability_type' => 'page',
                'hierarchical' => false,
                'publicly_queryable' => true,
                'query_var' => true,
                'exclude_from_search' => true,
                'show_in_nav_menus' => false,
                'menu_position' => 15,
                'menu_icon' => MO_THEME_URL . '/images/admin/blogs-stack.png',
                'rewrite' => array('slug' => 'page-section'),
                'supports' => array('title', 'editor', 'page-attributes', 'revisions')
            )
        );

    }

    function register_showcase_slide_type() {
        register_post_type('showcase_slide', array(
            'labels' => array(
                'name' => __('Showcase Slides', 'mo_theme'),
                'singular_name' => __('Showcase Slide', 'post type singular name', 'mo_theme'),
                'add_new' => __('Add New', 'mo_theme'),
                'add_new_item' => __('Add New Slide', 'mo_theme'),
                'edit_item' => __('Edit Slide', 'mo_theme'),
                'new_item' => __('New Slide', 'mo_theme'),
                'view_item' => __('View Slide', 'mo_theme'),
                'search_items' => __('Search Slides', 'mo_theme'),
                'not_found' => __('No Slides Found', 'mo_theme'),
                'not_found_in_trash' => __('No Slides Found in Trash', 'mo_theme'),
                'parent_item_colon' => ''
            ),
            'description' => __('A custom post type which has the required information to display showcase slides in a slider', 'mo_theme'),
            'public' => false,
            'show_ui' => true,
            'publicly_queryable' => false,
            'capability_type' => 'post',
            'hierarchical' => false,
            'exclude_from_search' => true,
            'menu_position' => 20,
            'menu_icon' => MO_THEME_URL . '/images/admin/slides-stack.png',
            'supports' => array('title', 'thumbnail', 'page-attributes')
        ));
    }

    function portfolio_type_edit_columns($columns) {

        $new_columns = array(
            'portfolio_category' => __('Portfolio Categories', 'mo_theme')
        );

        $columns = array_merge($columns, $new_columns);

        return $columns;
    }

    function portfolio_type_custom_columns($column) {
        global $post;
        switch ($column) {
            case 'portfolio_category':
                echo get_the_term_list($post->ID, 'portfolio_category', '', ', ', '');
                break;
        }
    }

    function sanitize_admin_bar() {
        global $wp_admin_bar;
        $wp_admin_bar->remove_menu('themes');
        $wp_admin_bar->remove_menu('customize');
    }

    /**
     * Enable Theme Features.
     *
     */
    function add_actions_filters() {

        /* Load all JS required by the theme */
        add_action('wp_enqueue_scripts', array(&$this, 'enqueue_scripts'));
        add_action('wp_enqueue_scripts', array(&$this, 'enqueue_styles'));

        add_action('admin_enqueue_scripts', array(&$this, 'admin_enqueue_scripts'));
        add_action('admin_enqueue_scripts', array(&$this, 'admin_enqueue_styles'), 18);

        add_action('wp_before_admin_bar_render', array(&$this, 'sanitize_admin_bar'));

        /* Register menus. */
        add_action('init', array(&$this, 'register_menus'), 11);

        /* Register thumbnails. */
        add_action('init', array(&$this, 'register_thumbs'), 11);

        /* Register widgets. */
        add_action('widgets_init', array(&$this, 'register_widgets'), 11);

        /* Manage Portfolio Columns */
        add_filter('manage_edit-portfolio_columns', array(&$this, 'portfolio_type_edit_columns'));
        add_action('manage_posts_custom_column', array(&$this, 'portfolio_type_custom_columns'));

        /* Make text widgets and term descriptions shortcode aware. */
        add_filter('widget_text', 'do_shortcode');
        add_filter('term_description', 'do_shortcode');

        add_action('wp_head', array(&$this, 'mo_init_custom_css'), 15); // load as late as possible

        add_action('wp_footer', array(&$this, 'mo_enqueue_plugin_styles'));

    }

    /* Output css as per user customization from the options panel */

    function mo_init_custom_css() {

        $output = '';

        $custom_css = mo_custom_css();

        if ($custom_css <> '') {
            $output .= $custom_css . "\n";
        }

        // Output styles
        if ($output <> '') {
            $output = "<!-- Options based styling -->\n<style type=\"text/css\">\n" . $output . "</style>\n";
            echo $output;
        }

    }

    /**
     * Enable Theme Features.
     *
     */
    function enable_theme_features() {

        remove_theme_support('Custom Backgrounds');

        add_theme_support('post-thumbnails', array('post', 'page', 'portfolio', 'showcase_slide'));

        // Add default posts and comments RSS feed links to head
        add_theme_support('automatic-feed-links');

        /* Add support for excerpts and entry-views to the 'page' post type. */
        add_post_type_support('page', array('excerpt'));

    }

    /**
     * Registers new widgets for the theme.
     *
     */
    function register_widgets() {

        register_widget('MO_Popular_Posts_Widget');
        register_widget('MO_Twitter_Widget');
        register_widget('MO_Recent_Posts_Widget');
        register_widget('MO_Flickr_Widget');
        register_widget('MO_Author_Widget');
        register_widget('MO_Featured_Posts_Widget');
        register_widget('MO_Contact_Info_Widget');

        // YARPP is far more experienced and is recommended to use the same with the YARPP template provided
        //register_widget('MO_Related_Posts_Widget');

        register_widget('MO_Advertisement_125_Widget');
        register_widget('MO_Social_Networks_Widget');
    }

    /**
     * Registers new thumbnails for the theme.
     *
     */
    function register_thumbs() {

        $image_sizes = $this->get_image_sizes();

        foreach (array_keys($image_sizes) as $key) {
            add_image_size($key, $image_sizes[$key][0], $image_sizes[$key][1], true);
        }

    }

    /**
     * Registers new nav menus for the theme. By default, the framework registers the 'primary' menu only.
     *
     */
    function register_menus() {
        register_nav_menus(
            array(
                'primary' => __('Primary Menu', 'mo_theme')
            )
        );
    }

    /**
     * Load all the damned Javascript entries for the theme
     *
     */
    function enqueue_scripts() {

        if (!is_admin()) {

            $layoutManager = MO_LayoutManager::getInstance();

            wp_enqueue_script('jquery-easing', MO_SCRIPTS_LIB_URL . '/jquery.easing.1.3.js', array('jquery'));
            wp_enqueue_script('jquery-tools', MO_SCRIPTS_LIB_URL . '/jquery.tools.min.js', array('jquery'), '1.2.7', true);
            wp_enqueue_script('jquery-validate', MO_SCRIPTS_LIB_URL . '/jquery.validate.min.js', array('jquery'), '1.9.0', true);
            wp_enqueue_script('mo-drop-downs', MO_SCRIPTS_LIB_URL . '/drop-downs.js', array('jquery'), '1.4.8', true);
            wp_enqueue_script('jquery-fitvideos', MO_SCRIPTS_LIB_URL . '/jquery.fitvids.js', array('jquery'), '1.0', true);
            wp_enqueue_script('jquery-appear', MO_SCRIPTS_LIB_URL . '/jquery.appear.js', array('jquery'), '0.3.3', true);
            wp_enqueue_script('jquery-waypoint', MO_SCRIPTS_LIB_URL . '/waypoints.js', array('jquery'), '2.0.2', true);
            wp_enqueue_script('jquery-stellar', MO_SCRIPTS_LIB_URL . '/jquery.stellar.min.js', array('jquery'), '0.6.2', true);


            /* Slider packs */
            wp_enqueue_script('jquery-flexslider', MO_SCRIPTS_LIB_URL . '/jquery.flexslider.js', array('jquery-easing'), '1.2', true);
            wp_enqueue_script('jquery-bxslider', MO_SCRIPTS_LIB_URL . '/jquery.bxslider.min.js', array('jquery-easing'), '4.1', true);
            $disable_sliders = mo_get_theme_option('mo_disable_sliders');
            $slider_type = mo_get_theme_option('mo_slider_choice', 'Nivo');
            if (mo_is_home_page_layout() && !$disable_sliders && $slider_type == 'Nivo')
                wp_enqueue_script('nivo-slider', MO_SCRIPTS_LIB_URL . '/jquery.nivo.slider.pack.js', array('jquery'), '3.2', false);

            if (is_page_template('template-single-page-site.php'))
                wp_enqueue_script('jquery-smooth-scroll', MO_SCRIPTS_LIB_URL . '/jquery.smooth-scroll.min.js', array('jquery'), '1.4.10', true);

            if (is_archive() || is_singular(array('post', 'page', 'portfolio')))
                wp_enqueue_script('jquery-prettyphoto', MO_SCRIPTS_LIB_URL . '/jquery.prettyPhoto.js', array('jquery'), '3.1.4', true);

            wp_enqueue_script('jquery-isotope', MO_SCRIPTS_LIB_URL . '/jquery.isotope.min.js', array('jquery'), '1.5.19', true);

            $ajax_portfolio = mo_get_theme_option('mo_ajax_portfolio');
            if ($layoutManager->is_portfolio_template() && $ajax_portfolio)
                wp_enqueue_script('jquery-infinitescroll', MO_SCRIPTS_LIB_URL . '/jquery.infinitescroll.min.js', array('jquery'), '2.0', true);

            if (is_singular())
                wp_enqueue_script("comment-reply");

            wp_enqueue_script('mo-slider-js', MO_SCRIPTS_URL . '/slider.js', array('jquery'), '1.0', true);
            wp_enqueue_script('mo-theme-js', MO_SCRIPTS_URL . '/main.js', array('jquery'), '1.0', true);

            $localized_array = array(
                'name_required' => __('Please provide your name', 'mo_theme'),
                'name_format' => __('Your name must consist of at least 5 characters', 'mo_theme'),
                'email_required' => __('Please provide a valid email address', 'mo_theme'),
                'url_required' => __('Please provide a valid URL', 'mo_theme'),
                'phone_required' => __('Minimum 5 characters required', 'mo_theme'),
                'human_check_failed' => __('The input the correct value for the equation above', 'mo_theme'),
                'message_required' => __('Please input the message', 'mo_theme'),
                'message_format' => __('Your message must be at least 15 characters long', 'mo_theme'),
                'success_message' => __('Your message has been sent. Thanks!', 'mo_theme')
            );

            $localized_array['blog_url'] = get_home_url();

            $localized_array['loading_portfolio'] = __('Loading the next set of posts...', 'mo_theme');
            $localized_array['finished_loading'] = __('No more items to load...', 'mo_theme');

            /* localized script attached to theme */
            wp_localize_script('mo-theme-js', 'mo_theme', $localized_array);

        }
    }

    function admin_enqueue_scripts($hook) {

        if (($hook == 'post.php') || ($hook == 'post-new.php') || ($hook == 'page.php') || ($hook == 'page-new.php')) {
            wp_enqueue_script('mo-admin-js', MO_SCRIPTS_URL . '/admin.js');
        }
    }

    function admin_enqueue_styles() {
        /* Register Style */
        wp_register_style('mo-admin-css', MO_THEME_URL . '/css/admin.css');
        wp_register_style('ot-custom-style', MO_THEME_URL . '/css/ot-custom-style.css', array('ot-admin-css'));

        /* Enqueue Style */
        wp_enqueue_style('ot-custom-style');
        wp_enqueue_style('mo-admin-css');
    }

    function enqueue_styles() {

        wp_register_style('pretty-photo', MO_THEME_URL . '/css/prettyPhoto.css', array(), false, 'screen');
        wp_register_style('icon-fonts', MO_THEME_URL . '/css/icon-fonts.css', array(), false, 'screen');

        wp_register_style('style-theme', get_stylesheet_uri(), array('pretty-photo', 'icon-fonts'), false, 'all');
        wp_register_style('style-responsive', MO_THEME_URL . '/css/responsive.css', array('style-theme'), false, 'all');

        $this->register_skin_styles(); // loads the skin specific styling

        wp_register_style('style-ie8', MO_THEME_URL . '/css/ie8.css', array('style-responsive'), false, 'screen');
        $GLOBALS['wp_styles']->add_data('style-ie8', 'conditional', 'IE 8');
        wp_enqueue_style('style-ie8');

        wp_register_style('style-ie9', MO_THEME_URL . '/css/ie9.css', array('style-responsive'), false, 'screen');
        $GLOBALS['wp_styles']->add_data('style-ie9', 'conditional', 'IE 9');
        wp_enqueue_style('style-ie9');

        wp_register_style('style-html5', 'http://html5shiv.googlecode.com/svn/trunk/html5.js', array('style-elements'), false, 'screen');
        $GLOBALS['wp_styles']->add_data('style-html5', 'conditional', 'IE 8');
        wp_enqueue_style('style-html5');

        /* The theme Custom CSS file for overriding css in a safe way */
        wp_register_style('style-custom', MO_THEME_URL . '/custom/custom.css', array('style-skin-css'), false, 'all');

        /* Enqueue all registered styles */
        wp_enqueue_style('pretty-photo');
        wp_enqueue_style('style-theme');
        wp_enqueue_style('style-responsive');
        wp_enqueue_style('style-skin-php');
        wp_enqueue_style('style-skin-css');
        wp_enqueue_style('style-custom');

    }


    function mo_enqueue_plugin_styles() {
        wp_register_style('style-plugins', MO_THEME_URL . '/css/plugins.css', array('style-theme'), false, 'all');

        wp_enqueue_style('style-plugins'); // load the plugins css in the footer
    }

    /*---------------------- The theme Skin CSS file -----------------------------------*/
    private function register_skin_styles() {


        $skin_name = mo_get_theme_skin();
        $skin_stylesheet_dir_uri = get_template_directory_uri() . '/css/skins/';

        wp_register_style('style-skin-php', $skin_stylesheet_dir_uri . 'skin.php?skin=' . $skin_name, array('style-responsive'), false, 'all');
        wp_register_style('style-skin-css', $skin_stylesheet_dir_uri . $skin_name . '.css', array('style-skin-php'), false, 'all');
    }


}