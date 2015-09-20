<?php
// look up for the path
require_once('mo_wp_load.php');
// check for rights
if ( !current_user_can('edit_pages') && !current_user_can('edit_posts') ) 
	wp_die(__("You are not allowed to be here", 'mo_theme'));
    global $wpdb;
?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Shortcode Set</title>
	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php echo get_option('blog_charset'); ?>" />
	<script language="javascript" type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/tiny_mce_popup.js"></script>
	<script language="javascript" type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/utils/mctabs.js"></script>
	<script language="javascript" type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/utils/form_utils.js"></script>
	<script language="javascript" type="text/javascript" src="<?php echo  get_template_directory_uri() ?>/framework/admin/tinymce/tinymce.js"></script>
	<base target="_self" />
</head>
<body id="link" onLoad="tinyMCEPopup.executeOnLoad('init();');document.body.style.display='';
document.getElementById('shortcode_select').focus();" style="display: none">
<!-- <form onsubmit="insertLink();return false;" action="#"> -->
	<!--  Retain tabs for future use though not using now -->
	<form name="shortcode_tabs" action="#">
	<div class="tabs">
		<ul>
	<li id="shortcode_tab" class="current"><span><a href="javascript:mcTabs.displayTab('shortcode_tab','shortcode_panel');" onMouseDown="return false;">Shortcodes</a></span></li>

		</ul>
	</div>
	
	<div class="panel_wrapper">
		<div id="shortcode_panel" class="panel current">
		<br />
		<table border="0" cellpadding="4" cellspacing="0">
         <tr>
            <td nowrap="nowrap"><label for="shortcode_select"><?php _e("Select Shortcode", 'shortcode'); ?></label></td>
            <td><select id="shortcode_select" name="shortcode_select" style="width: 200px">
                <option value="0">No Style!</option>
				<?php
				    //Grab hold of all the shortcodes out there stored in the wordpress global var shortcode_tags
					if(is_array($shortcode_tags)) 
					{
						$i=1;

						foreach ($shortcode_tags as $mo_shortcode => $short_code_value) 
						{
						    // List only Livemesh Framework shortcodes, not others assuming they are prefixed with mo_
							if( stristr($short_code_value, 'mo_') ) 
							{
								$mo_shortcode_name = str_replace('mo_', '' ,$short_code_value);
								$mo_shortcode_name = str_replace('_', ' ' ,$mo_shortcode_name);
								$mo_shortcode_name = ucwords($mo_shortcode_name);
							
								echo '<option value="' . $mo_shortcode . '" >' . $mo_shortcode_name.'</option>' . "\n";
								echo '</optgroup>'; 

								$i++;
							}
						}
					}
			?>
            </select></td>
          </tr>
         
        </table>
		</div>
		
	</div>
		
	
	</div>

	<div class="mceActionPanel">
		<div style="float: left">
			<input type="button" id="cancel" name="cancel" value="Cancel" onClick="tinyMCEPopup.close();" />
		</div>

		<div style="float: right">
			<input type="submit" id="insert" name="insert" value="Insert" onClick="tzshortcodesubmit();" />
		</div>
	</div>
</form>
</body>
</html>
