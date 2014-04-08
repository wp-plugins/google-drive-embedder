<?php

/**
 * Plugin Name: Google Drive Embedder
 * Plugin URI: http://wp-glogin.com/drive
 * Description: Easily browse for Google Drive documents and embed directly in your posts and pages. Extends the popular Google Apps Login plugin so no extra user authentication (or admin setup) is required. 
 * Version: 2.0
 * Author: Dan Lester
 * Author URI: http://wp-glogin.com/
 * License: GPL3
 */

require_once( plugin_dir_path(__FILE__).'/core/core_google_drive_embedder.php' );

class gdm_basic_google_drive_embedder extends core_google_drive_embedder {
	
	// Singleton
	private static $instance = null;
	
	public static function get_instance() {
		if (null == self::$instance) {
			self::$instance = new self;
		}
		return self::$instance;
	}
	
	// Basic specific
	
	protected function get_extra_js_name() {
		return 'basic';
	}
	
	// AUX
	
	protected function my_plugin_basename() {
		$basename = plugin_basename(__FILE__);
		if ('/'.$basename == __FILE__) { // Maybe due to symlink
			$basename = basename(dirname(__FILE__)).'/'.basename(__FILE__);
		}
		return $basename;
	}
	
	protected function my_plugin_url() {
		$basename = plugin_basename(__FILE__);
		if ('/'.$basename == __FILE__) { // Maybe due to symlink
			return plugins_url().'/'.basename(dirname(__FILE__)).'/';
		}
		// Normal case (non symlink)
		return plugin_dir_url( __FILE__ );
	}
	
}

// Global accessor function to singleton
function GoogleDriveEmbedder() {
	return gdm_basic_google_drive_embedder::get_instance();
}

// Initialise at least once
GoogleDriveEmbedder();

?>