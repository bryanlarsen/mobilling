<?php
/**
 * Monitor what the requests going to wp-admin/admin-ajax.php
 *
 * This is useful for determining the cause of high traffic to the admin-ajax.php file
 *
 * @package Monitor Admin Ajax
 * @author Donovan Hernandez
 */

// If it's not a POST request, just move along
if ( $_SERVER['REQUEST_METHOD'] != "POST" ) {
	return;
}

// See if we only want to monitor certain files
if ( defined( 'WPE_MONITOR_ADMIN_AJAX_FILE' ) && WPE_MONITOR_ADMIN_AJAX_FILE ) {
	if ( $_SERVER['PHP_SELF'] != WPE_MONITOR_ADMIN_AJAX_FILE ) {
		return;
	}
}

// Load the class
if ( ! class_exists( 'Monitor_Admin_Ajax', false ) ) {
	require_once( WPE_PLUGIN_DIR . '/class-monitor_admin_ajax.php' );
}

$logger = Monitor_Admin_Ajax::get_instance();
$logger->write_log();
