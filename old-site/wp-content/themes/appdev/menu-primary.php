<?php
/**
 * Primary Menu Template
 *
 * Displays the Primary Menu if it has active menu items.
 *
 * @package Appdev
 * @subpackage Template
 */

$menu_type = 'primary';

//For the one page template pages which  are not home pages, custom build menu and avoid wordpress menu
if (is_page_template('template-single-page-site.php') && !is_front_page()) :
    mo_build_nav_menu_for_one_page_template($menu_type);
elseif (has_nav_menu('primary')) :
    echo '<div id="primary-menu" class="dropdown-menu-wrap clearfix">';

    wp_nav_menu(array(
        'theme_location' => 'primary',
        'container' => false,
        'menu_class' => 'menu clearfix',
        'fallback_cb' => false
    ));
    echo '</div><!-- #primary-menu -->';
else:
    mo_build_nav_menu_one_page_site($menu_type);
endif;

