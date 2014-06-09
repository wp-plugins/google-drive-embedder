<?php

/**
 * Plugin Name: Google Drive Embedder
 * Plugin URI: http://wp-glogin.com/drive
 * Description: Easily browse for Google Drive documents and embed directly in your posts and pages. Extends the popular Google Apps Login plugin so no extra user authentication (or admin setup) is required. 
 * Version: 2.3
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
	
	// ADMIN
	
	protected function get_options_name() {
		return 'gdm_basic';
	}
	
	protected function gdm_mainsection_text() {
		?>
		<p>There are no settings to configure in this free version of Google Drive Embedder.</p>
		<p>Please 
		<a href="http://wp-glogin.com/drive/?utm_source=Drive%20Settings&utm_medium=freemium&utm_campaign=Drive" target="_blank">visit our website</a> 
		for more details of our premium version, including the following extensions:</p>
		<ol>
			<li><b>Embed Folders:</b> simply keep your Google Drive folder up-to-date with your files, and your staff or website visitors will always be able to view a list of the latest documents.</li>
			<li><b>Calendars:</b> pick from your Google Calendars and provide download links to ICAL or XML, or embed them directly in your site.</li>
			<li><b>Google Docs export:</b> provide links to downloadable versions of Google Docs, e.g. Spreadsheets exported as PDF or Excel.</li>
    		<li><b>Embed Images:</b> serve them directly from Google Drive, respecting your Google sharing settings.</li>
    		<li><b>Support and updates for one year.</b></li>
		</ol>
		<p><a href="http://wp-glogin.com/drive/?utm_source=Drive%20Settings&utm_medium=freemium&utm_campaign=Drive" target="_blank">Click here for details or purchase</a></p>
		<?php
	}
	
	// Don't need a submit button here
	protected function gdm_options_submit() {
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