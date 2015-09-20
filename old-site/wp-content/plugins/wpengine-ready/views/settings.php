<div class="wrap">
	<div id="screen-icon" class="icon32"><img src="<?php echo $logo; ?>" height="32px" width="32px"/></div>
	<h2>WPEngine Compatibility Check</h2>

		<div class="checkzone loading" >
			<div class="refreshit"><img src="<?php echo $this->root_url; ?>/assets/images/refresh.png" /></div>
			<div rel="<?php echo $nonce; ?>" class="temp-message"><?php echo $temp; ?></div>

			<div class="content" style="display:none;"></div>

		</div>

</div><!-- .wrap-->

<?php $this->view("sidebar"); ?>