<?php


$tab_count = 0;
$tabs = array();

function mo_tabgroup_shortcode($atts, $content)
{

    global $tab_count, $tabs;

    $tab_count = 0; //count reset

    do_shortcode($content); // Explode [tab] shortcode
    $output = '';
    if (is_array($tabs)) {
        foreach ($tabs as $tab) {
            $tab_elements[] = '<li><a class="" href="#">' . $tab['title'] . '</a></li>';
            $panes[] = '<div class="pane">' . $tab['content'] . '</div>';
        }
        $output .= "\n" . '<ul class="tabs">' . implode("\n", $tab_elements) . '</ul>' . "\n";
        $output .= "\n" . '<div class="panes">' . implode("\n", $panes) . '</div>' . "\n";

    }
    return $output;
}

add_shortcode('tabgroup', 'mo_tabgroup_shortcode');


function mo_tab_shortcode($atts, $content)
{
    global $tab_count, $tabs;

    extract(shortcode_atts(array(
        'title' => 'Tab %d'
    ), $atts));

    $tabs[$tab_count] = array('title' => $title, 'content' => do_shortcode($content));

    $tab_count++;
}

add_shortcode('tab', 'mo_tab_shortcode');

/*
* jQuery Tools - Accordion shortcode 
*/

function mo_accordion_shortcode($atts, $content = null)
{

    $output = '<div class="accordion">' . do_shortcode($content) . '</div>';

    return $output;
}

add_shortcode('accordion', 'mo_accordion_shortcode');

function mo_pane_shortcode($atts, $content = null)
{

    extract(shortcode_atts(array(
        'title' => '',
        'current' => false,
    ), $atts));

    if ($current) {
        $output = '<div class="tab current">' . $title . '</div>';
        $output .= '<div class="pane" style="display:block;">' . do_shortcode($content) . '</div>';
    }
    else {
        $output = '<div class="tab">' . $title . '</div>';
        $output .= '<div class="pane">' . do_shortcode($content) . '</div>';
    }

    return $output;

}

add_shortcode('pane', 'mo_pane_shortcode');

function mo_toggle_shortcode($atts, $content = null, $code)
{
    extract(shortcode_atts(array(
        'title' => '',
        'type' => ''
    ), $atts));
    $output = '<div class="toggle' . (empty($type) ? '' : ' ' . $type) . '">';
    $output .= '<div class="toggle-label">' . $title . '</div>';
    $output .= '<div class="toggle-content">' . do_shortcode($content) . '</div>';
    $output .= '</div>';

    return $output;
}

add_shortcode('toggle', 'mo_toggle_shortcode');