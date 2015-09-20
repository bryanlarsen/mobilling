<?php
/*
Plugin Name: Brankic Photostream Widget
Plugin URI: http://www.brankic1979.com
Description: Showing your photostream from Dribbble, Flickr, Pinterest, Instagram in the sidebar
Author: Brankic1979
Version: 1.3
Author URI: http://www.brankic1979.com/
 */
class BraPhotostreamWidget extends WP_Widget
{
	function BraPhotostreamWidget() {
		$widget_options = array(
		'classname'		=>		'bra-photostream-widget',
		'description' 	=>		'Showing photostream from Dribbble, Flickr, Pinterest or Instagram in your sidebar'
		);
		
		parent::WP_Widget('bra_photostream_widget', 'Brankic Photostream Widget', $widget_options);
	}
    
    function wptuts_scripts_important()
    {
        $root = plugin_dir_url( __FILE__ );

        wp_register_script( 'bra_photostream', $root."bra_photostream_widget.js", array('jquery'), '1.3', true );
        wp_enqueue_script( 'bra_photostream' );
        
        wp_register_style( 'bra_photostream', $root."bra_photostream_widget.css");
        wp_enqueue_style( 'bra_photostream' );
    }
    

	
	function widget( $args, $instance ) {
		extract ( $args, EXTR_SKIP );
        if (!isset($instance['title'])) $instance['title'] = ""; 
        if (!isset($instance['social_network'])) $instance['social_network'] = "";  
        if (!isset($instance['user'])) $instance['user'] = "";  
        if (!isset($instance['limit'])) $instance['limit'] = ""; 
        if (!isset($instance['hover_color'])) $instance['hover_color'] = "#ffffff";   
        
        //add_action( 'wp_enqueue_scripts', 'wptuts_scripts_important'); 
         $root = plugin_dir_url( __FILE__ );

        wp_register_script( 'bra_photostream', $root."bra_photostream_widget.js", array('jquery'), '1.3', true );
        wp_enqueue_script( 'bra_photostream' );
        
        wp_register_style( 'bra_photostream', $root."bra_photostream_widget.css");
        wp_enqueue_style( 'bra_photostream' );

        
		$title = ( $instance['title'] ) ? $instance['title'] : '';
		$user = ( $instance['user'] ) ? $instance['user'] : 'brankic1979';
        $social_network = ( $instance['social_network'] ) ? $instance['social_network'] : 'instagram'; 
        $limit = ( $instance['limit'] ) ? $instance['limit'] : '9';
        $hover_color = ( $instance['hover_color'] ) ? $instance['hover_color'] : '#ffffff';
		echo $before_widget;
		echo $before_title . $title . $after_title;
        
    $unique_id =  $user . $social_network . $limit ;
    $unique_id = preg_replace("/[^A-Za-z0-9]/", '', $unique_id);
    $html = '<div class="photostream" id="' . $unique_id  .'"></div>';
    $html .= '<script type="text/javascript"> jQuery(document).ready(function($){ ';
    $html .= '$("#' . $unique_id .'").bra_photostream({user: "' . $user . '", limit:' . $limit . ', social_network: "' . $social_network . '"});';
    $html .= '});</script>';
    $html .= '<style type="text/css">';
    $html .= '<!--';
    $html .= ' .photostream li a:hover{background-color: ' . $hover_color . '!important; border: 1px solid ' . $hover_color . '!important; }';
    $html .= '-->';
    $html .= '</style>';
    echo $html;
?>

<?php

		echo $after_widget;
	}
          
        	
	function form( $instance ) {
        
        $root = plugin_dir_url( __FILE__ );
        wp_enqueue_script("miniColors", $root."jquery.miniColors.min.js", array('jquery'));
        wp_enqueue_style("miniColors", $root."jquery.miniColors.css");
        
        if (!isset($instance['title'])) $instance['title'] = "Your Photostream";  
        if (!isset($instance['user'])) $instance['user'] = "brankic1979";  
        if (!isset($instance['limit'])) $instance['limit'] = "8";  
        if (!isset($instance['social_network'])) $instance['social_network'] = "instagram"; 
        if (!isset($instance['hover_color'])) $instance['hover_color'] = "#000000";   		
         
        ?>

        <p>
		<label for="<?php echo $this->get_field_id('title'); ?>">
		Title: 
		<input id="<?php echo $this->get_field_id('title'); ?>"
				name="<?php echo $this->get_field_name('title'); ?>"
				value="<?php echo esc_attr( $instance['title'] ); ?>" 
                class="widefat" type="text"/>
		</label>
        </p>

        <p>
		<label for="<?php echo $this->get_field_id('user'); ?>">
		Photostream user: 
		<input id="<?php echo $this->get_field_id('user'); ?>"
				name="<?php echo $this->get_field_name('user'); ?>"
				value="<?php echo esc_attr( $instance['user'] ); ?>" 
                class="widefat" type="text"/>
		</label>
		</p>
    
        <p>
		<label for="<?php echo $this->get_field_id('limit'); ?>">
		No of pics displayed: 
		<input id="<?php echo $this->get_field_id('limit'); ?>"
				name="<?php echo $this->get_field_name('limit'); ?>"
				value="<?php echo esc_attr( $instance['limit'] ); ?>" 
                class="" size="1"/>
		</label>
        </p>

        <p>
        <label for="<?php echo $this->get_field_id('social_network'); ?>">
        Social Network
        
        <select name="<?php echo $this->get_field_name('social_network'); ?>" 
                  id="<?php echo $this->get_field_id('social_network'); ?>"
                  class="">
            <option value="dribbble" <?php if ($instance['social_network'] == "dribbble") echo 'selected="selected"' ?>>Dribbble</option>
            <option value="pinterest" <?php if ($instance['social_network'] == "pinterest") echo 'selected="selected"' ?>>Pinterest</option>
            <option value="flickr" <?php if ($instance['social_network'] == "flickr") echo 'selected="selected"' ?>>Flickr</option>
            <option value="instagram" <?php if ($instance['social_network'] == "instagram") echo 'selected="selected"' ?>>Instagram</option>
        </select>
        </label>
        </p>
        
        <p>
        <label for="<?php echo $this->get_field_id('hover_color'); ?>">
        Hover color (with #): 
        <input id="<?php echo $this->get_field_id('hover_color'); ?>"
                name="<?php echo $this->get_field_name('hover_color'); ?>"
                value="<?php echo esc_attr( $instance['hover_color'] ); ?>" 
                class="color-picker" size="10"/>
        </label>
        </p>
    
        
        

		<?php 
	}
	
}
	
function bra_photostream_widget_init() {
	register_widget("BraPhotostreamWidget");
}
add_action('widgets_init','bra_photostream_widget_init');