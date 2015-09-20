<?php
/*
Plugin Name: WPEngine Ready
Version: 1.1
Description: This plugin scans your wordpress installation to ensure it is ready to migrate to WP-Engine
Author: WPEngine
Author URI: http://www.wpengine.com
Plugin URI: http://www.wpengine.com
License: GPL
*/

/**
 * Primary plugin class.
 *
**/	

if(!class_exists('WPE_Check')) {

	class WPE_Check {
		
		public $version = '1.1';
		public $name = 'wpengine-check';
		public $root_dir = '';
		public $root_url = '';
		public $wp_content = '';
		public $to_check = array();
		public $incompatibilities = array();
		public $disallowed_list = array();
		public $messages = array();




		function __construct() {
			register_activation_hook(__FILE__,array($this,'activate'));
			$this->root_dir = dirname(__FILE__);
			$this->root_url = plugins_url('',__FILE__);		
			add_action('admin_init',array($this,'admin_init'));

			if ( defined( 'ABSPATH' ) )
				$this->wp_content = rtrim(ABSPATH,'/') . DIRECTORY_SEPARATOR . 'wp-content' . DIRECTORY_SEPARATOR;

			if ( false === ( $transient_list = get_transient( 'wpe_ready_disallowed_functions' ) ) ) {
				$bl = wp_remote_get('http://wp-common.s3.amazonaws.com/banned_functions.txt');
				$this->disallowed_list = explode("\n",$bl['body']);
				sort($this->disallowed_list);
				set_transient( 'wpe_ready_disallowed_functions', $this->disallowed_list, 10*60 ); // store transient for ~10 minute max
			} else {
				$this->disallowed_list = $transient_list;
			}

			if(defined('WP_ALLOW_MULTISITE')) {
				add_action('network_admin_menu',array($this,'admin_menu'));
				add_action('network_admin_notices',array($this,'render_messages'));
			} else {
				add_action('admin_menu',array($this,'admin_menu'));
				add_action('admin_notices',array($this,'render_messages'));
			}
			
			add_action('wpengine_compat',array($this,'page_hook'));
			add_action('wp_ajax_wpe_check',array($this,'load_content'));
			add_action('wp_ajax_wpe_ajax',array($this,'ajax_handler'));
		}



		function admin_menu() {
			add_submenu_page( defined('WP_ALLOW_MULTISITE')?'settings.php':'options-general.php', __("WPEngine Compatibility Check",$this->name), __("WPEngine Ready",$this->name), 'manage_options', 'wpengine_compat', array($this,'settings_page'));
		}



		/**
		 * Activation Hook
		 * 
		**/
		function activate() {
			$version = get_option('wpengine_check','version_installed');
			if(!$version) {
				$options = get_option('wpengine_check')?get_option('wpengine_check'):array(); 
				$options['version_installed'] = $this->version;
				update_option('wpengine_check',$options);
			} 
		}



		/**
		 * Set admin notice to direct user to process page. 
		 * 
		**/
		function admin_init() {
			$options = get_option('wpengine_check');
			if(!$options['process_last_run'] and $_REQUEST['page'] !== 'wpengine_compat') {
				$admin_link = defined('WP_ALLOW_MULTISITE')?network_admin_url('settings.php?page=wpengine_compat'):admin_url('options-general.php?page=wpengine_check');
				$this->set_message(array('message'=>$this->language('admin|never-run',array('%%LINK%%'=>$admin_link)),'class'=>'updated'));
			}
			if($_REQUEST['page'] == 'wpengine_compat') {
				wp_enqueue_style('wpengine-compat',$this->root_url.'/assets/style.css');
				wp_enqueue_script('wpengine-js',$this->root_url.'/assets/wpengine.jquery.js',array('jquery'));
			}
		}



		/**
		 * Set a system message
		 * 
		**/
		function set_message($args) {
			$this->messages[] = $args;
		}



		/**
		 * Render Messages
		 * 
		**/
		function render_messages() {
			if(!empty($this->messages)) {
				foreach( $this->messages as $message) {
					 $this->view('admin-message',$message);
				}	
			}
		}



		/**
		 * Load a View
		 * 
		**/
		function view($view, $data = null ) {
			$file = $this->root_dir.'/views/'.$view.'.php';
			if(file_exists($file)) {
				if(!empty($data)) {
					extract($data);
				}
				include($file);
			} else {
				return new WP_Error('view-error','Could not locate the specified view');
			}
		}



		/**
		 * Function to process a language request 
		 * 
		**/
		function language($segments,$replacement = null) {
			if(empty($segments)) { return; }
				
			include($this->root_dir.'/language.php');
		
			$segs = explode('|',$segments);	
			$output = $lang;
	
			foreach($segs as $seg) {
				$output = $output[$seg];
			}

			if($replacement != null AND is_array($replacement)) {
				foreach($replacement as $token => $value) {
					$output = str_replace($token,$value,$output);
				}
			}
			
			if($output != '') {
				return __($output,$this->name);	
			}
	
		}



		/**
		* Settings Page
		 * 
		**/
		function settings_page() {

			//logo
			$data = array('logo'=>$this->root_url.'/assets/images/logo.png');

			//set the loading message
			if(!defined('DOING_AJAX')) {
				$data['temp'] = $this->language('admin|ajax-wait');
			}
			
			//create a nonce to be used by ajax calls
			$data['nonce'] = wp_create_nonce('wpengine');
			
			//do the view
			$this->view('settings',$data);
		}



		/**
		* Loads the report
		 * 
		**/
		function load_content() {
			
			//security
			if(!wp_verify_nonce($_REQUEST['_wpnonce'],'wpengine')) { die("Invalid nonce, please contact site administrator."); }
			
			//check version and setup output data
			$data = array();
			$core_version = get_preferred_from_update_core();
			if($core_version->response == 'latest') {
				$data['version'] = array(
					'class'=>'success',
					'message'=> $this->language('admin|version-success'),
					'image'=>$this->root_url.'/assets/images/tick_32.png'
				);
			} else {
				$update_link = defined('WP_ALLOW_MULTISITE')?network_admin_url('update-core.php'):admin_url('update-core.php');
				$data['version'] = array(
					'class'=>'errors',
					'message'=>$this->language('admin|version-fail',array('%%VERSION%%'=>$wp_version,'%%LINK%%'=>$update_link)),
					'image'=>$this->root_url.'/assets/images/alert.png'
				);
			}
			
			//get the remote blacklist
			$bl = wp_remote_get('http://wp-common.s3.amazonaws.com/blacklist.txt');
			$bl = explode("\n",$bl['body']);
			$active_plugins = get_option('active_plugins');
			
			//setup blacklisted.
			$data['blacklisted'] = array();
			foreach($active_plugins as $plugin) {
				$plugin_array = explode('/',$plugin); 
				if($result = array_intersect($bl,$plugin_array)) {
					$data['blacklisted'][] = array('src'=>$plugin,'name'=>implode($result));
				}
			}
			
			if(count($data['blacklisted']) > 0) {
				$data['blacklist_image'] = $this->root_url.'/assets/images/alert.png';
				$data['blacklist_message'] = $this->language('admin|blacklist-fail');
			} else {
				$data['blacklist_image'] = $this->root_url.'/assets/images/tick_32.png';
				$data['blacklist_message'] = $this->language('admin|blacklist-success');
			}
									
			//update the option to remove the default admin nag
			$options = get_option('wpengine_check');
			$options['process_last_run'] = date('Y-m-d H:i:s');
			update_option('wpengine_check',$options);
						
			$this->scan_directories_for_files();

			$data['progress_bar'] = $this->root_url . '/assets/images/ajax-loader.gif';
			$data['count_to_check'] = count($this->to_check);
			$data['json_list_to_check'] = json_encode($this->to_check);

			$data['root_url'] = $this->root_url;

			$this->view('content',$data);	
			die();
		}



		/**
		* Ajax Handler
		 * 
		**/
		function ajax_handler() {

			if(!isset($_REQUEST['action'])) {
				wp_die("Oops something went wrong");
			}
			
			extract($_REQUEST);
			
			switch($wpe_action) {
				case 'wpe_deactivate_plugin':
					if(!wp_verify_nonce($_wpnonce,'wpe_deactivate_plugin') ) { 
						wp_die('Invalid Nonce'); 
					} else {
						deactivate_plugins($plugin_src);
						echo 1;
					}
				break;
				case 'wpe_parse_file_list':

				// How/why is $wpe_file_list already an array?! extract?! Default WP stuff?! GRAWR!!!
					$this->queue_and_parse_ajax_list($_REQUEST['wpe_file_list']);

				break;
			}
			die();
		}



		/**
		* Scan the following /wp-content/ directories
		 * 
		**/
		function scan_directories_for_files() {

			$this->find_php_files_to_check( $this->wp_content . 'plugins' );
			$this->find_php_files_to_check( $this->wp_content . 'themes' );
			$this->find_php_files_to_check( $this->wp_content . 'mu-plugins' );

		}



		/**
		* Recursively look for php files to scan for banned functions
		 * 
		**/
		function find_php_files_to_check( $dir ) {

			if ( is_dir($dir) && $handle = opendir( $dir ) ) {

				while (false !== ( $file = readdir( $handle ) ) ) {

					$full_path = $dir . DIRECTORY_SEPARATOR . $file;
					$context_path = str_replace( $this->wp_content, '', $full_path );

					if ( is_dir($full_path) && ( '.' !== substr($file, 0, 1) ) ) {
						$this->find_php_files_to_check( $full_path );
					} elseif ( 'php' == pathinfo( $file, PATHINFO_EXTENSION ) ) {
						$this->to_check[] = $context_path;
					}

				}

			}

		} //find_php_files_to_check



		/**
		* Receive a list of (partial) file names, scan each one, return to the client with json encoded results
		 * 
		**/
		function queue_and_parse_ajax_list( $list ) {


			foreach( $list as $file ) {

				$file_path = $this->wp_content . str_replace('\\\\', '\\', $file);
				$this->parse_php_file($file_path);

			}

			exit(json_encode($this->incompatibilities));

		}



		/**
		* Parse through the given php file for disallowed functions
		 * 
		**/
		function parse_php_file( $file ) {

			if ( 0 >= filesize($file) ) return false; // worry not about empty files

			if ( strpos('..', $file ) ) exit("Cannot traverse in reverse!");

			if ( !is_readable( $file )) exit("$file isn't a file");

			if ( ! $handle = fopen( $file, 'r' ) ) {
				$this->incompatibilities[$file][] = array( 'line'=>'all', 'disallowed'=>'Could not view', 'incompatibility' => 'Could not read file...' );
				return false;
			}

			$line_count = 1;

			while ( $line = fgets( $handle ) ) {

				foreach ( $this->disallowed_list as $disallowed ) {

					if ( FALSE !== stripos( $line, $disallowed ) ) {

						if ( preg_match('/\b('.$disallowed.')\s*(\(|\[)/i', $line) ) {
							$this->incompatibilities[$file][] = array('line'=>$line_count, 'disallowed'=>$disallowed, 'incompatibility'=>(strlen($line) > 100 ? substr($line, 0, 99) . '...' : $line ) );
						}

					}

				}
				$line_count++;
			}

			fclose($handle);

		} //parse_php_file

	} //WPE_Check

} // endif

//initate the plugin and set vars into globals array
$GLOBALS['wpe_check'] = new WPE_Check();?>
