<?php

/**
 * The functions file to initialize everything - add features, extensions, override hooks and filters.
 *
 *
 * @package Appdev
 * @subpackage Functions
 * @version 1.0
 * @author LiveMesh
 * @copyright Copyright (c) 2012, LiveMesh
 * @link http://portfoliotheme.org/
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

$theme_cache = array();
$options_cache = array();

/* Load the Livemesh theme framework. */
require_once( get_template_directory() . '/framework/framework.php' );
$mo_theme = new MO_Framework();


?>