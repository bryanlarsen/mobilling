<h3 class="<?php $version['class']; ?>"><img src="<?php echo $version['image']; ?>" class="alert_icon"/> WordPress Version</h3>
<div id="message" class="<?php echo $version['class']; ?>"><p><?php echo $version['message']; ?></p></div>	

<h3><img src="<?php echo $blacklist_image; ?>" class="alert_icon"/> Blacklisted Plugins</h3>
<p><?php echo $blacklist_message; ?></p>
 
<ul>
<?php foreach($blacklisted as $plugin): ?>
	<li><strong><?php echo $plugin['name']; ?></strong> | <a href="<?php echo $plugin['src']; ?>" rel="<?php echo wp_create_nonce('wpe_deactivate_plugin'); ?>" >Deactivate Now</a> <img src="<?php echo admin_url('images/wpspin_light.gif'); ?>" class="" style="display:none;" title="" alt=""></li>
<?php endforeach; ?>
</ul>

<h3 id="wpe_ready_pot_incompats" data-wpe-img-url="<?php echo $root_url.'/assets/images/'; ?>"> Potential Incompatibilities</h3>

<div id="wpe_original_file_list" style="display:none;"><?php echo $json_list_to_check; ?></div>

<div id="wpe_scanning_info">
	<p>Scanning <span id="wpe_ready_site_compat_file_count"><?php echo $count_to_check; ?></span> files for potential incompatibilities</p>
	<p><img id="wpe_ready_site_progress_img" src="<?php echo $progress_bar; ?>"></p>
</div>

<p>Found: <span id="wpe_ready_site_compat_found_count">0</span></p>

<p><ul id="wpe_results_list"></ul></p>
