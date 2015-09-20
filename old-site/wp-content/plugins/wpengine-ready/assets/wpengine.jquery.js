jQuery.noConflict();
jQuery(document).ready(function($) {
	
	wpe_load_report();
	
	$('.refreshit').click(function() { 				
		$('.content').html('');
		$('.temp-message').show();
		$('.checkzone').addClass('engineloading');
		wpe_load_report(); 
	});

function wpe_start_parse_requests( number_of_files_per_request ) {

	var json_list = $('#wpe_original_file_list').text();
	var file_list = $.parseJSON(json_list);
	var file_list_length = file_list.length;
	var incompatibility_count = 0;
	
	var wpe_results_list = $('#wpe_results_list');
	number_of_files_per_request = (number_of_files_per_request === null ? 35 : number_of_files_per_request);

	function grab_batch() {
		var how_many = number_of_files_per_request;
		var request_list = new Array();

		while ( how_many-- && file_list.length ) {
			request_list.push(file_list.pop());
		};

		return request_list;
	}

	function update_content( decoded_json ) {

		wpe_update_value( 'wpe_ready_site_compat_found_count', incompatibility_count );
		$.each(decoded_json, function( filename, lines ) {

			$('<li></li>',{
				text : filename
			}).appendTo(wpe_results_list);
			
			$.each(lines, function( incompat_num, details ) {
				$('<li></li>',{
					text : details.disallowed+' on line #'+details.line+': ',
					class : 'wpe_result_list_detail'
				}).appendTo(wpe_results_list);

				var add_code_here = $('li.wpe_result_list_detail').last();

				$('<code></code>',{
					text : details.incompatibility
				}).appendTo( add_code_here );

				incompatibility_count++;
				wpe_update_value('wpe_ready_site_compat_found_count',incompatibility_count);
			});
		});

		wpe_update_value( 'wpe_ready_site_compat_file_count', file_list.length );
	
	}

	function finish_updates() {

			$('#wpe_ready_site_progress_img').toggle();
			$('#wpe_scanning_info').first().text('Scan complete ('+file_list_length+' total files scanned)');

			var compat_h3 = $('h3#wpe_ready_pot_incompats');
			var img_src = compat_h3.data('wpeImgUrl');
			var compat_img = img_src+( incompatibility_count > 0 ? 'alert.png' : 'tick_32.png' );

			$('<img />',{
				src 	: 	compat_img,
				class 	: 	'alert_icon'
			}).prependTo( compat_h3 );
/**/
	}

	function wpe_update_value( tagID, value ) {
		$('#'+tagID).text(value);
	}

	function make_request( batch ) {
		$.post(ajaxurl, {
			'action'		:	'wpe_ajax',
			'wpe_action'	:	'wpe_parse_file_list',
			'wpe_file_list'	:	batch
			}, function(decoded_json) {
				update_content( decoded_json );
				trampoline();
			}, 'json'
		);
	}

	function trampoline() {

		var batch = grab_batch();

		if ( batch.length ) {
			setTimeout( function(){make_request(batch)}, 250);
		} else {
			finish_updates();
		}

	}

	trampoline();

} //wpe_start_parse_requests

function wpe_load_report() {
	setTimeout(function () {
		$.post(ajaxurl,{
			'_wpnonce': $('.temp-message').attr('rel'),
			'action'	:	'wpe_check'
			}, function(response)  {
				$('.checkzone').removeClass('engineloading');
				$('.temp-message').hide();
				$('.content').html(response).show();
				
  				$('.content li').each(function(index,obj) {
 
					$(this).find('a').click(function(e) {	
						e.preventDefault();
						var plugin_src = $(this).attr('href');
						var _wpnonce = $(this).attr('rel');
						$.post(ajaxurl, {
							'action'	:	'wpe_ajax',
							'wpe_action':	'wpe_deactivate_plugin',
							'plugin_src':	plugin_src,
							'_wpnonce'	:	_wpnonce
							},function(response) {
								message = $(obj).find('a');							
								message.fadeOut(1,function() {
									message.remove();
									$(obj).find('img').show();	
									setTimeout(function() {
										$(obj).append('<span>Plugin deactivated.</span>');
										$(obj).find('img').hide();	
									},500);
								});
							});										
						});
					});
				wpe_start_parse_requests( 50 );
			}
	)},1500);
}

});