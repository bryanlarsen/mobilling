<?php
/**
 * Custom Meta Boxes using Option Tree framework
 * @package Livemesh_Framework
 */

/**
 * Initialize the meta boxes.
 */
add_action('admin_init', 'mo_custom_meta_boxes');

if (!function_exists('mo_custom_meta_boxes')) {


    function mo_custom_meta_boxes() {

        $one_page_meta_box = array(
            'id' => 'mo_one_page_options',
            'title' => 'Single Page Options',
            'desc' => '',
            'pages' => array('page'), 'context' => 'side',
            'priority' => 'default',
            'fields' => array(
                array(
                    'label' => 'Choose the Page Sections for display',
                    'id' => 'mo_page_section_select_for_one_page',
                    'type' => 'custom-post-type-checkbox',
                    'desc' => 'Choose the page sections to display if Single Page Site template is chosen for this page. Displays links to these sections in the top navigation menu and the sticky menu.',
                    'std' => '',
                    'rows' => '',
                    'post_type' => 'page_section',
                    'taxonomy' => '',
                    'class' => ''
                ),
                array(
                    'id' => 'mo_disable_slider_section',
                    'label' => 'Disable Sliders and Disable Home Page Slider Area Widget',
                    'desc' => '',
                    'std' => '',
                    'type' => 'checkbox',
                    'desc' => 'Do not display top section for the page with slider or static content if Single Page Site template is chosen for this page.',
                    'choices' => array(
                        array(
                            'value' => 'Yes',
                            'label' => 'Yes',
                            'src' => ''
                        )
                    )
                ),
                array(
                    'label' => 'Choose the Pages for Navigation Menu',
                    'id' => 'mo_page_nav_select_for_one_page',
                    'type' => 'page-checkbox',
                    'desc' => 'Choose the pages to display in the top navigation menu and in the sticky menu if Single Page Template is chosen for this page.',
                    'std' => '',
                    'rows' => '',
                    'post_type' => '',
                    'taxonomy' => '',
                    'class' => ''
                )
            )
        );

        ot_register_meta_box($one_page_meta_box);

        $header_meta_box = array(
            'id' => 'mo_entry_header_options',
            'title' => 'Header Options',
            'desc' => '',
            'pages' => array('post', 'page', 'portfolio'),
            'context' => 'normal',
            'priority' => 'high',
            'fields' => array(
                array(
                    'id' => 'mo_description',
                    'label' => 'Description',
                    'desc' => '',
                    'std' => '',
                    'type' => 'textarea',
                    'desc' => 'Enter the description of the page/post. Shown under the entry title.',
                    'rows' => '2'
                ),
                array(
                    'id' => 'mo_entry_title_background',
                    'label' => 'Entry Title Background',
                    'desc' => '',
                    'std' => '',
                    'type' => 'background',
                    'desc' => 'Specify a background for your page/post title and description.'
                ),
                array(
                    'id' => 'mo_entry_title_height',
                    'label' => 'Page/Post Title Height',
                    'desc' => 'Specify the approximate height in pixel units that the entry title area for a page/post occupies along with the background. <br><br> Does not apply when custom heading content is specified. ',
                    'type' => 'text',
                    'std' => '',
                    'rows' => '',
                    'class' => ''
                ),
                array(
                    'id' => 'mo_disable_breadcrumbs_for_entry',
                    'label' => 'Disable Breadcrumbs on this Post/Page',
                    'desc' => '',
                    'std' => '',
                    'type' => 'checkbox',
                    'desc' => 'Disable Breadcrumbs on this Post/Page. Breadcrumbs can be a hindrance in many pages that showcase marketing content. Home pages and wide layout pages will have no breadcrumbs displayed.',
                    'choices' => array(
                        array(
                            'value' => 'Yes',
                            'label' => 'Yes',
                            'src' => ''
                        )
                    )
                )
            )
        );

        ot_register_meta_box($header_meta_box);

        $custom_header_meta_box = array(
            'id' => 'mo_custom_entry_header_options',
            'title' => 'Custom Header Options',
            'desc' => '',
            'pages' => array('post', 'page', 'portfolio'),
            'context' => 'normal',
            'priority' => 'high',
            'fields' => array(
                array(
                    'id' => 'mo_custom_heading_background',
                    'label' => 'Custom Heading Background',
                    'desc' => '',
                    'std' => '',
                    'type' => 'background',
                    'desc' => 'Specify a background for custom heading content that replaces the regular page/post title area. Spans entire screen width or maximum available width (boxed layout).'
                ),
                array(
                    'id' => 'mo_custom_heading_content',
                    'label' => 'Custom Heading Content',
                    'desc' => '',
                    'std' => '',
                    'type' => 'textarea',
                    'desc' => 'Enter custom heading content HTML markup that replaces the regular page/post title area. This can be any of these - image, a slider, a slogan, purchase/request quote button, an invitation to signup or any plain marketing material.<br><br>Shown under the logo area. Be aware of SEO implications and <strong>use heading tags appropriately</strong>.',
                    'rows' => '8'
                ),
                array(
                    'id' => 'mo_wide_heading_layout',
                    'label' => 'Custom Heading Content spans entire screen width',
                    'desc' => '',
                    'std' => '',
                    'type' => 'checkbox',
                    'desc' => 'Make the heading content span the entire screen width. While the background graphics or color spans entire screen width for custom heading content, the HTML markup consisting of heading text and content is restricted to the 1140px grid in the center of the window. <br>Choosing this option will make the content span the entire screen width or max available width(boxed layout).<br><strong>Choose this option when when you want to go for a custom heading with maps or a wide slider like the revolution slider in the custom heading area</strong>.',
                    'choices' => array(
                        array(
                            'value' => 'Yes',
                            'label' => 'Yes',
                            'src' => ''
                        )
                    )
                )
            )
        );

        ot_register_meta_box($custom_header_meta_box);

        $my_sidebars = get_user_defined_sidebars();

        $general_meta_box = array(
            'id' => 'mo_sidebar_options',
            'title' => 'Choose Custom Sidebar',
            'desc' => '',
            'pages' => array('post', 'page'),
            'context' => 'side',
            'priority' => 'default',
            'fields' => array(
                array(
                    'id' => 'mo_primary_sidebar_choice',
                    'label' => 'Custom Sidebar Choice',
                    'desc' => 'Custom sidebar for the post/page. <i>Useful if the post/page is not designated as full width.</i>',
                    'std' => '',
                    'type' => 'select',
                    'rows' => '',
                    'post_type' => '',
                    'taxonomy' => '',
                    'class' => '',
                    'choices' => $my_sidebars
                )
            )
        );

        ot_register_meta_box($general_meta_box);

        /*$page_meta_box = array(
            'id' => 'mo_page_options',
            'title' => 'Page Options',
            'desc' => '',
            'pages' => array('page'),
            'context' => 'normal',
            'priority' => 'high',
            'fields' => array(

                array(
                    'id'          => 'mo_featured_portfolio',
                    'label'       => 'Select the featured portfolio',
                    'desc'        => 'Select the featured portfolio item to be displayed on top of the page.',
                    'std'         => '',
                    'type'        => 'custom-post-type-select',
                    'rows'        => '',
                    'post_type'   => 'portfolio',
                    'taxonomy'    => '',
                    'class'       => ''
                )

            )
        );

        ot_register_meta_box($page_meta_box);*/

        $post_meta_box = array(
            'id' => 'mo_post_thumbnail_detail',
            'title' => 'Post Thumbnail Options',
            'desc' => '',
            'pages' => array('post'),
            'context' => 'normal',
            'priority' => 'high',
            'fields' => array(

                array(
                    'label' => 'Use Video as Thumbnail',
                    'id' => 'mo_use_video_thumbnail',
                    'type' => 'checkbox',
                    'desc' => 'Specify if video will be used as a thumbnail instead of a featured image.',
                    'choices' => array(
                        array(
                            'label' => 'Yes',
                            'value' => 'Yes'
                        )
                    ),
                    'std' => '',
                    'rows' => '',
                    'class' => ''
                ),

                array(
                    'label' => 'Video URL',
                    'id' => 'mo_video_thumbnail_url',
                    'type' => 'text',
                    'desc' => 'Specify the URL of the video (Youtube or Vimeo only).',
                    'std' => '',
                    'rows' => '',
                    'class' => ''
                ),

                array(
                    'label' => 'Use Slider as Thumbnail',
                    'id' => 'mo_use_slider_thumbnail',
                    'type' => 'checkbox',
                    'desc' => 'Specify if slider will be used as a thumbnail instead of a featured image or a video.',
                    'choices' => array(
                        array(
                            'label' => 'Yes',
                            'value' => 'Yes'
                        )
                    ),
                    'std' => '',
                    'rows' => '',
                    'class' => ''
                ),

                array(
                    'label' => 'Images for thumbnail slider',
                    'id' => 'post_slider',
                    'desc' => 'Specify the images to be used a slider thumbnails for the post',
                    'type' => 'list-item',
                    'class' => '',
                    'settings' => array(
                        array(
                            'id' => 'slider_image',
                            'label' => 'Image',
                            'desc' => '',
                            'std' => '',
                            'type' => 'upload',
                            'class' => '',
                            'choices' => array()
                        )
                    )
                )

            )
        );

        ot_register_meta_box($post_meta_box);

    }
}

if (!function_exists('get_user_defined_sidebars')) {


    function get_user_defined_sidebars() {
        $my_sidebars = array(
            array(
                'label' => 'Default',
                'value' => 'default'
            )
        );

        $sidebar_list = mo_get_theme_option('mo_sidebar_list');

        if (!empty($sidebar_list)) {
            foreach ($sidebar_list as $sidebar_item) {
                $sidebar = array('label' => $sidebar_item['title'], 'value' => $sidebar_item['id']);
                $my_sidebars [] = $sidebar;
            }
        }

        return $my_sidebars;
    }
}