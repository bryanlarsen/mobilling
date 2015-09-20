<?php
# Database Configuration
define( 'DB_NAME', 'wp_jevyjevjevs' );
define( 'DB_USER', 'jevyjevjevs' );
define( 'DB_PASSWORD', 'mYHMI2QpTFayLrMBTbfA' );
define( 'DB_HOST', '127.0.0.1' );
define( 'DB_HOST_SLAVE', '127.0.0.1' );
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_unicode_ci');
$table_prefix = 'wp_';

# Security Salts, Keys, Etc
define('AUTH_KEY',         '||Wo3x)bhavBXfF={0tKpC(HSP-n-eYI]7e)Ez%uC#t-J-<^SDGB7*}CyB*%+rDZ');
define('SECURE_AUTH_KEY',  'e+)2KJ*s_Az|(=;h0aJ^)e Z#V5Rc`vGns>1}wcQ04T;kC[8YSuzBl4-Lx~:~7Yz');
define('LOGGED_IN_KEY',    '(KZ&)!M[@+gxI<N(gg-=CL4=,bp%X6-~j*8qRrz1FiU@Au?P^bG&6ErfgE* _{(N');
define('NONCE_KEY',        'aF`qI=l(pAo{~3>-HrPjBW*Z/hG-lETail4``B</EnR~yi;D|<g8|;]q/q%U@~(2');
define('AUTH_SALT',        '4k%hw.UYY<9Zgr4!`?^hE:ejQR7_=+%wCG&c=I+nJU8;8Fmh&)p`r8IpRZ-KU,8H');
define('SECURE_AUTH_SALT', 'BmF$TzDh:(IoCV6!|qt!q*Br7hcxAoA=|($]~yy,+cm(|l#[#Aj+DApG]j-jH5)}');
define('LOGGED_IN_SALT',   'z)i1|GnH:;z^28cMwiUex1G_UB/G.Sm<RRdLJ1Fh8u{6::b@;2SW)K-};|VWtQ.+');
define('NONCE_SALT',       ')Sl{*X3=;({/NE)};B|kDA3+{Jo3,zl25gc;38|HWh1}F0ou?;ZnZW/%=%_[L[lg');


# Localized Language Stuff

define( 'WP_CACHE', TRUE );

define( 'WP_AUTO_UPDATE_CORE', false );

define( 'PWP_NAME', 'jevyjevjevs' );

define( 'FS_METHOD', 'direct' );

define( 'FS_CHMOD_DIR', 0775 );

define( 'FS_CHMOD_FILE', 0664 );

define( 'PWP_ROOT_DIR', '/nas/wp' );

define( 'WPE_APIKEY', 'a9ab64fbc52b6e8f1731b9096137dac55bb8bdbd' );

define( 'WPE_FOOTER_HTML', "" );

define( 'WPE_CLUSTER_ID', '41755' );

define( 'WPE_CLUSTER_TYPE', 'pod' );

define( 'WPE_ISP', true );

define( 'WPE_BPOD', false );

define( 'WPE_RO_FILESYSTEM', false );

define( 'WPE_LARGEFS_BUCKET', 'largefs.wpengine' );

define( 'WPE_CACHE_TYPE', 'standard' );

define( 'WPE_LBMASTER_IP', '45.79.111.175' );

define( 'WPE_CDN_DISABLE_ALLOWED', true );

define( 'DISALLOW_FILE_EDIT', FALSE );

define( 'DISALLOW_FILE_MODS', FALSE );

define( 'DISABLE_WP_CRON', false );

define( 'WPE_FORCE_SSL_LOGIN', false );

define( 'FORCE_SSL_LOGIN', false );

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define( 'WPE_EXTERNAL_URL', false );

define( 'WP_POST_REVISIONS', FALSE );

define( 'WPE_WHITELABEL', 'wpengine' );

define( 'WP_TURN_OFF_ADMIN_BAR', false );

define( 'WPE_BETA_TESTER', false );

umask(0002);

$wpe_cdn_uris=array ( );

$wpe_no_cdn_uris=array ( );

$wpe_content_regexs=array ( );

$wpe_all_domains=array ( 0 => 'jevyjevjevs.wpengine.com', 1 => 'mo-billing.ca', 2 => 'www.mo-billing.ca', );

$wpe_varnish_servers=array ( 0 => 'pod-41755', );

$wpe_special_ips=array ( 0 => '45.79.111.175', );

$wpe_ec_servers=array ( );

$wpe_largefs=array ( );

$wpe_netdna_domains=array ( );

$wpe_netdna_domains_secure=array ( );

$wpe_netdna_push_domains=array ( );

$wpe_domain_mappings=array ( );

$memcached_servers=array ( );

define( 'WPE_SFTP_PORT', 2222 );
define('WPLANG','');

# WP Engine ID


define('PWP_DOMAIN_CONFIG', 'www.mo-billing.ca' );

# WP Engine Settings






# That's It. Pencils down
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');
require_once(ABSPATH . 'wp-settings.php');

$_wpe_preamble_path = null; if(false){}
