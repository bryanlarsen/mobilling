<?php
/**
 * Mobile Menu Template
 *
 * Displays the Mobile Menu if it has active menu items.
 *
 * @package Appdev
 * @subpackage Template
 */

$menu_type = 'mobile';

if (!is_front_page() && is_page_template('template-single-page-site.php')) :
    mo_build_nav_menu_for_one_page_template($menu_type);
elseif (has_nav_menu('primary')) :
    echo '<div id="mobile-menu" class="menu-container clearfix">';

    wp_nav_menu(array('theme_location' => 'primary',
        'container' => false,
        'menu_class' => 'menu inner',
        'fallback_cb' => false
    ));
    echo '</div><!-- #mobile-menu -->';
else:
    mo_build_nav_menu_one_page_site($menu_type);
endif;
