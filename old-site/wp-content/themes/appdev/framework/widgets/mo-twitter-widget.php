<?php
/**
 * Plugin Name: Livemesh Framework Twitter Widget
 * Plugin URI: http://portfoliotheme.org/
 * Description: A widget that displays the tweets for the user.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

class MO_Twitter_Widget extends MO_Widget {

    /**
     * Widget setup.
     */
    function MO_Twitter_Widget() {

        parent::init();

        /* Widget settings. */
        $widget_ops = array('classname' => 'twitter-widget', 'description' => __('A widget that displays the twitter stream.', 'mo_theme'));

        /* Widget control settings. */
        $control_ops = array('width' => 300, 'height' => 350, 'id_base' => 'mo-twitter-widget');

        /* Create the widget. */
        $this->WP_Widget('mo-twitter-widget', __('Twitter Widget', 'mo_theme'), $widget_ops, $control_ops);
    }

    /* How to display the widget on the screen. */
    function widget($args, $instance) {

        extract($args);

        /* Our variables from the widget settings. */
        $title = apply_filters('widget_title', $instance['title']);
        $twitter_id = $instance['twitter_id'];
        $tweet_count = $instance['tweet_count'];
        $twitter_text = $instance['twitter_text'];


        /* Before widget (defined by themes). */
        echo $before_widget;

        /* Display the widget title if one was input (before and after defined by themes). */
        if (trim($title) != '')
            echo $before_title . $title . $after_title;
        ?>


    <div id="twitter"></div>

    <div id="twitter-footer"><a href="http://twitter.com/<?php echo $twitter_id ?>"
                                class="twitter-url"><?php echo $twitter_text ?></a></div>

    <?php /* Scripts by Twitter which work on previous div to replace 'twitter_update_list' list with latest tweets for the twitter id provided */ ?>
    <script type="text/javascript">
        mo_options.mo_twitter_id = "<?php echo $twitter_id; ?>";
        mo_options.mo_tweet_count = <?php echo $tweet_count; ?>;
    </script>

    <?php
        /* After widget (defined by themes). */
        echo $after_widget;
    }

    /**
     * Update the widget settings.
     */
    function update($new_instance, $old_instance) {
        $instance = $old_instance;

        /* Strip tags for title and name to remove HTML (important for text inputs). */
        $instance['title'] = strip_tags($new_instance['title']);
        $instance['twitter_id'] = strip_tags($new_instance['twitter_id']);
        $instance['tweet_count'] = strip_tags($new_instance['tweet_count']);
        $instance['twitter_text'] = strip_tags($new_instance['twitter_text']);

        return $instance;
    }

    /**
     * Displays the widget settings controls on the widget panel.
     * Make use of the get_field_id() and get_field_name() function
     * when creating your form elements. This handles the confusing stuff.
     */
    function form($instance) {

        /* Set up some default widget settings. */
        $defaults = array('title' => __('Twitter Stream', 'mo_theme'), 'twitter_id' => 'twitter', 'tweet_count' => '4', 'twitter_text' => __('Follow me on Twitter', 'mo_theme'));
        $instance = wp_parse_args((array)$instance, $defaults);
        ?>

    <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Widget Title:', 'mo_theme'); ?></label>
        <input type="text" class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo $instance['title']; ?>"/>
    </p>

    <p>
        <label for="<?php echo $this->get_field_id('twitter_id'); ?>"><?php _e('Twitter ID:', 'mo_theme'); ?></label>
        <input type="text" class="widefat" id="<?php echo $this->get_field_id('twitter_id'); ?>"
               name="<?php echo $this->get_field_name('twitter_id'); ?>"
               value="<?php echo $instance['twitter_id']; ?>"/>
    </p>

    <p>
        <label
                for="<?php echo $this->get_field_id('tweet_count'); ?>"><?php _e('Tweets to Display:', 'mo_theme'); ?></label>
        <input type="text" class="smallfat" id="<?php echo $this->get_field_id('tweet_count'); ?>"
               name="<?php echo $this->get_field_name('tweet_count'); ?>"
               value="<?php echo $instance['tweet_count']; ?>"/>
    </p>

    <p>
        <label
                for="<?php echo $this->get_field_id('twitter_text'); ?>"><?php _e('Display Text:', 'mo_theme'); ?></label>
        <input type="text" class="widefat" id="<?php echo $this->get_field_id('twitter_text'); ?>"
               name="<?php echo $this->get_field_name('twitter_text'); ?>"
               value="<?php echo $instance['twitter_text']; ?>"/>
    </p>

    <?php
    }

}

?>