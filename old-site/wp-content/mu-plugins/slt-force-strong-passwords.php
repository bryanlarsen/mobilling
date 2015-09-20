<?php
/*
Plugin Name: Force Strong Passwords
Description: Forces users to use something strong when updating their passwords.
Version: 1.3.3
Author: Steve Taylor
Author URI: http://sltaylor.co.uk
License: GPLv2
*/

// mu-plugins/slt-force-strong-passwords.php
if ( getenv( 'WPENGINE_FORCE_STRONG_PASSWORDS' ) !== 'off' ) {
	require WPMU_PLUGIN_DIR.'/force-strong-passwords/slt-force-strong-passwords.php';
}
