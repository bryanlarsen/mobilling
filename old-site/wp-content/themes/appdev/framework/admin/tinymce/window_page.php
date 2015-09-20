<?php
// look up for the path
require_once('mo_wp_load.php');
// check for rights
if (!current_user_can('edit_pages') && !current_user_can('edit_posts'))
    wp_die(__("You are not allowed to be here", 'mo_theme'));
global $wpdb;
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Shortcode Set</title>
    <meta http-equiv="Content-Type"
          content="<?php bloginfo('html_type'); ?>; charset=<?php echo get_option('blog_charset'); ?>"/>
    <script language="javascript" type="text/javascript"
            src="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/tiny_mce_popup.js"></script>
    <script language="javascript" type="text/javascript"
            src="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/utils/mctabs.js"></script>
    <script language="javascript" type="text/javascript"
            src="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/utils/form_utils.js"></script>
    <script language="javascript" type="text/javascript"
            src="<?php echo  get_template_directory_uri() ?>/framework/admin/tinymce/tinymce.js"></script>
    <base target="_self"/>
</head>
<body id="link" onLoad="tinyMCEPopup.executeOnLoad('init();');document.body.style.display='';
document.getElementById('shortcode_select').focus();" style="display: none">
<!-- <form onsubmit="insertLink();return false;" action="#"> -->
<!--  Retain tabs for future use though not using now -->
<form name="shortcode_tabs" action="#">
    <div class="tabs">
        <ul>
            <li id="shortcode_tab" class="current"><span><a
                        href="javascript:mcTabs.displayTab('shortcode_tab','shortcode_panel');"
                        onMouseDown="return false;">Shortcodes</a></span>
            </li>

        </ul>
    </div>

    <div class="panel_wrapper">
        <div id="shortcode_panel" class="panel current">
            <br/>
            <table border="0" cellpadding="4" cellspacing="0">
                <tr>
                    <td nowrap="nowrap"><label
                            for="shortcode_select"><?php _e("Select Shortcode", 'shortcode'); ?></label></td>
                    <td><select id="shortcode_select" name="shortcode_select" style="width: 200px">
                            /* NOTE: For updating the shortcode list just use the php script below the HTML and view
                            frame source in browser */
                            <optgroup label="Content Shortcodes">
                                <option value="segment">Segment</option>
                                <option value="heading2">Heading2</option>
                            </optgroup>
                            <optgroup label="Column Shortcodes">
                                <option value="two_columns_template">Two Columns Template</option>
                                <option value="three_columns_template">Three Columns Template</option>
                                <option value="four_columns_template">Four Columns Template</option>

                                <option value="one_col">1 Column</option>
                                <option value="two_col">2 Columns</option>
                                <option value="three_col">3 Columns</option>
                                <option value="four_col">4 Columns</option>
                                <option value="five_col">5 Columns</option>
                                <option value="six_col">6 Columns</option>
                                <option value="seven_col">7 Columns</option>
                                <option value="eight_col">8 Columns</option>
                                <option value="nine_col">9 Columns</option>
                                <option value="ten_col">10 Columns</option>
                                <option value="eleven_col">11 Columns</option>

                                <option value="one_col_last">1 Column Last</option>
                                <option value="two_col_last">2 Columns Last</option>
                                <option value="three_col_last">3 Columns Last</option>
                                <option value="four_col_last">4 Columns Last</option>
                                <option value="five_col_last">5 Columns Last</option>
                                <option value="six_col_last">6 Columns Last</option>
                                <option value="seven_col_last">7 Columns Last</option>
                                <option value="eight_col_last">8 Columns Last</option>
                                <option value="nine_col_last">9 Columns Last</option>
                                <option value="ten_col_last">10 Columns Last</option>
                                <option value="eleven_col_last">11 Columns Last</option>

                                <option value="one_half">One Half</option>
                                <option value="one_third">One Third</option>
                                <option value="one_fourth">One Fourth</option>
                                <option value="one_sixth">One Sixth</option>

                                <option value="one_half_last">One Half Last</option>
                                <option value="one_third_last">One Third Last</option>
                                <option value="one_fourth_last">One Fourth Last</option>
                                <option value="one_sixth_last">One Sixth Last</option>

                                <option value="two_third">Two Third</option>
                                <option value="three_fourth">Three Fourth</option>
                                <option value="two_third_last">Two Third Last</option>
                                <option value="three_fourth_last">Three Fourth Last</option>
                            </optgroup>
                            <optgroup label="Home Page Shortcodes">
                                <option value="service_box1">Service Box 1</option>
                                <option value="service_box2">Service Box 2</option>
                                <option value="project_showcase">Project Showcase</option>
                            </optgroup>
                            <optgroup label="Slider Shortcodes">
                                <option value="show_thumbnail_slider">Show Thumbnail Slider</option>
                                <option value="responsive_slider">Responsive Slider</option>
                                <option value="responsive_carousel">Responsive Carousel</option>
                            </optgroup>
                            <optgroup label="Image Shortcodes">
                                <option value="image">Image</option>
                            </optgroup>
                            <optgroup label="Tab Shortcodes">
                                <option value="tabs">Tabs</option>
                                <option value="accordion">Accordion</option>
                                <option value="toggle">Toggle</option>
                            </optgroup>
                            <optgroup label="Button Shortcodes">
                                <option value="grey_button">Grey Button</option>
                                <option value="black_button">Black Button</option>
                                <option value="white_button">White Button</option>
                                <option value="orange_button">Orange Button</option>
                                <option value="red_button">Red Button</option>
                                <option value="blue_button">Blue Button</option>
                                <option value="purple_button">Purple Button</option>
                                <option value="green_button">Green Button</option>
                                <option value="pink_button">Pink Button</option>
                                <option value="light_blue_button">Light Blue Button</option>
                                <option value="yellow_button">Yellow Button</option>
                            </optgroup>
                            <optgroup label="Typography Shortcodes">
                                <option value="pullquote">Pullquote</option>
                                <option value="blockquote">Blockquote</option>
                                <option value="highlight1">Highlight1</option>
                                <option value="highlight2">Highlight2</option>
                                <option value="code">Code</option>
                            </optgroup>


                            <optgroup label="Dropcap Shortcodes">
                                <option value="dropcap1">Dropcap1</option>
                                <option value="dropcap2">Dropcap2</option>
                                <option value="dropcap3">Dropcap3</option>
                                <option value="dropcap4">Dropcap4</option>
                            </optgroup>
                            <optgroup label="List Shortcodes">
                                <option value="list">List</option>
                            </optgroup>
                            <optgroup label="Media Shortcodes">
                                <option value="html5_audio">Html5 Audio</option>
                                <option value="youtube_video">Youtube Video</option>
                                <option value="vimeo_video">Vimeo Video</option>
                                <option value="dailymotion_video">Dailymotion Video</option>
                                <option value="flash_video">Flash Video</option>
                            </optgroup>
                            <optgroup label="Divider Shortcodes">
                                <option value="divider">Divider</option>
                                <option value="divider_space">Divider Space</option>
                                <option value="divider_line">Divider Line</option>
                                <option value="divider_fancy">Divider Fancy</option>
                                <option value="divider_top">Divider Top</option>
                                <option value="clear">Clear</option>
                                <option value="header_fancy">Header Fancy</option>
                            </optgroup>
                            <optgroup label="Message Shortcodes">
                                <option value="info">Info</option>
                                <option value="note">Note</option>
                                <option value="attention">Attention</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                                <option value="tip">Tip</option>
                                <option value="errors">Errors</option>
                            </optgroup>
                            <optgroup label="Box Shortcodes">
                                <option value="box_frame">Box Frame</option>
                                <option value="box_frame2">Box Frame2</option>
                            </optgroup>
                            <optgroup label="Posts Shortcodes">
                                <option value="recent_posts">Recent Posts</option>
                                <option value="popular_posts">Popular Posts</option>
                                <option value="category_posts">Category Posts</option>
                                <option value="tag_posts">Tag Posts</option>
                                <option value="custom_taxonomy_posts">Custom Taxonomy Posts</option>
                                <option value="show_custom_post_types">Show Custom Post Types</option>
                                <option value="show_post_snippets">Show Post Snippets</option>
                                <option value="show_thumbnail_slider">Show Thumbnail Slider</option>
                            </optgroup>

                            <optgroup label="Social Shortcodes">
                                <option value="contact_form">Contact Form</option>
                                <option value="subscribe_rss">Subscribe Rss</option>
                                <option value="social_list">Social List</option>
                                <option value="donate">Donate</option>
                                <option value="private">Private</option>
                                <option value="protected">Protected</option>
                            </optgroup>

                            <optgroup label="Misc Shortcodes">
                                <option value="read_more">Read More</option>
                            </optgroup>
                            <?php
                            //Grab hold of all the shortcodes out there stored in the wordpress global var shortcode_tags
                            /*if (is_array($shortcode_tags)) {
                                $i = 1;

                                foreach ($shortcode_tags as $mo_shortcode => $short_code_value) {
                                    if (is_array($short_code_value))
                                        continue;
                                    // List only Livemesh Framework shortcodes, not others assuming they are prefixed with mo_
                                    if (stristr($short_code_value, 'mo_')) {
                                        $mo_shortcode_name = str_replace('_', ' ', $mo_shortcode);
                                        $mo_shortcode_name = ucwords($mo_shortcode_name);

                                        echo '<option value="' . $mo_shortcode . '">' . $mo_shortcode_name . '</option>' . "\n";

                                        $i++;
                                    }
                                }
                            }*/
                            ?>
                        </select></td>
                </tr>

            </table>
        </div>

    </div>


    </div>

    <div class="mceActionPanel">
        <div style="float: left">
            <input type="button" id="cancel" name="cancel" value="Cancel" onClick="tinyMCEPopup.close();"/>
        </div>

        <div style="float: right">
            <input type="submit" id="insert" name="insert" value="Insert" onClick="shortcodeSubmit();"/>
        </div>
    </div>
</form>
</body>
</html>
