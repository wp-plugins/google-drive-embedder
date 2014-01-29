<?php

/**
 * Plugin Name: Google Drive Embedder
 * Plugin URI: http://wp-glogin.com/drive
 * Description: Easily browse for Google Drive documents and embed directly in your posts and pages. Extends the popular Google Apps Login plugin so no extra user authentication (or admin setup) is required. 
 * Version: 1.2
 * Author: Dan Lester
 * Author URI: http://wp-glogin.com/
 * License: GPL3
 */

class gdm_google_drive_embedder {
	
	// Singleton
	private static $instance = null;
	
	public static function get_instance() {
		if (null == self::$instance) {
			self::$instance = new self;
		}
		return self::$instance;
	}
	
	protected function __construct() {
		$this->add_actions();
	}
	
	public function gdm_gather_scopes($scopes) {
		return array_merge($scopes, Array('https://www.googleapis.com/auth/drive.readonly',
										  'https://www.googleapis.com/auth/drive.file'));
	}

	public function gdm_media_button() {
		global $wp_version;
		$output = '';
	
		if ( version_compare( $wp_version, '3.5', '<' ) ) {
			$img = '<img src="' . $this->my_plugin_url() . 'images/gdm-media.png" alt="Add Drive File"/>';
			$output = '<a href="#TB_inline?width=700&height=484&inlineId=gdm-choose-drivefile" id="gdm-thickbox-trigger" class="thickbox" title="Add Drive file">' . $img . '</a>';
		} else {
			$img = '<span class="wp-media-buttons-icon" id="gdm-media-button"></span>';
			$output = '<a href="#TB_inline?width=700&height=484&inlineId=gdm-choose-drivefile" id="gdm-thickbox-trigger" class="thickbox button" title="Add Drive File" style="padding-left: .4em;">'
					  .$img.' Add Drive File</a>';
		}
		echo $output;
	}
	
	public function gdm_admin_load_scripts(){
		wp_enqueue_script( 'gdm_choose_drivefile_js', $this->my_plugin_url().'js/gdm-choose-drivefile.js', array('jquery') );
		wp_enqueue_script( 'google-js-api', 'https://apis.google.com/js/client.js?onload=gdmHandleGoogleJsClientLoad', array('gdm_choose_drivefile_js') );
		wp_enqueue_style( 'gdm_choose_drivefile_css', $this->my_plugin_url().'css/gdm-choose-drivefile.css' );
		wp_enqueue_script( 'thickbox' );
		wp_enqueue_style( 'thickbox' );
	}
	
	public function gdm_admin_footer() {
		// Get Google Client ID
		$clientid = apply_filters('gal_get_clientid', '');
		
		// Get current user's email address
		$current_user = wp_get_current_user();
		$email = $current_user->user_email;
		?>
		<div id="gdm-choose-drivefile" style="display: none;">
			<div class="wrap gdm-wrap">
				
				<div id="gdm-search-area">
					<input type="text" id="gdm-search-box" placeholder="Enter text to search (then press Enter)" disabled="disabled"></input>
				</div>
			
				<div id="gdm-thinking" class="gdm-browsebox">
					<div id="gdm-thinking-text">Loading...</div>
				</div>
				
				<div id="gdm-authbtn" class="gdm-browsebox" style="display: none;">
					<div>
						<a href="#" id="gdm-start-browse2">Click to authenticate via Google</a>
					</div>
				</div>

				<div id="gdm-filelist" class="gdm-browsebox" style="display: none;"></div>
				<div id="gdm-nextprev-div" class="gdm-group">
					<a href="#" id="gdm-prev-link" style="display: none;">Previous</a>
					<a href="#" id="gdm-next-link" style="display: none;">Next</a>
				</div>
				
				<div id="gdm-linktypes-div" class="gdm-group">
					<div>
						<span class="gdm-linktypes-span">
							<input type="radio" name="gdm-linktypes" id="gdm-linktype-normal" checked="checked" />
							<label for="gdm-linktype-normal">Normal file link</label>
						</span>
						<span id="gdm-linktype-normal-options" class="gdm-linktype-options">
							<input type="checkbox" id="gdm-linktype-normal-window" checked="checked" /> 
							<label for="gdm-linktype-normal-window">Open in new window</label>
						</span>
					</div>
					
					<div>
						<span class="gdm-linktypes-span">
							<input type="radio" name="gdm-linktypes" id="gdm-linktype-plain" />
							<label for="gdm-linktype-plain">Plain text link</label>
						</span>
						<span id="gdm-linktype-plain-options" class="gdm-linktype-options">
							<input type="checkbox" id="gdm-linktype-plain-window" checked="checked" /> 
							<label for="gdm-linktype-plain-window">Open in new window</label>
						</span>
					</div> 
					
					<div class="gdm-embeddable-only">
						<span class="gdm-linktypes-span">
							<input type="radio" name="gdm-linktypes" id="gdm-linktype-embed" />
							<label for="gdm-linktype-embed">Embed document</label>
						</span>
						<span id="gdm-linktype-embed-options" class="gdm-linktype-options">
							<label for="gdm-linktype-embed-width">Width</label> <input type="text" id="gdm-linktype-embed-width" size="8" value="100%" />
							<label for="gdm-linktype-embed-height">Height</label> <input type="text" id="gdm-linktype-embed-height" size="8" value="400" />
						</span>
					</div> 
				</div>
				
				<p class="submit">
					<input type="button" id="gdm-insert-drivefile" class="button-primary" 
							value="Insert File" disabled="disabled" />
					<a id="gdm-cancel-drivefile-insert" class="button-secondary" onclick="tb_remove();" title="Cancel">Cancel</a>
				</p>
				
				<input type="hidden" value="<?php echo htmlentities($clientid); ?>" id="gdm-clientid" /> 
				<input type="hidden" value="<?php echo htmlentities($email); ?>" id="gdm-useremail" />
			</div>
		</div>
		<?php
	}
	
	public function gdm_admin_downloads_icon() {
		
		$images_url  = $this->my_plugin_url() . 'images/';
		$icon_url    = $images_url . 'gdm-media.png';
		?>
		<style type="text/css" media="screen">
			#gdm-media-button {
				background: url(<?php echo $icon_url; ?>) no-repeat;
				background-size: 20px 20px;
			}
		</style>
		<?php
	}
	
	// SHORTCODES
	
	public function gdm_shortcode_display_drivefile($atts, $content=null) {
		if (!isset($atts['url'])) {
			return '<b>gdm-drivefile requires a url attribute</b>';
		}
		$url = $atts['url'];
		$title = isset($atts['title']) ? $atts['title'] : $url; // Should be html-encoded already
		
		$linkstyle = isset($atts['style']) && in_array($atts['style'], Array('normal', 'plain', 'embed')) 
						? $atts['style'] : 'normal';
		$returnhtml = '';
		switch ($linkstyle) {
			case 'normal':
				$imghtml = '';
				if (isset($atts['icon'])) {
					$imghtml = '<img src="'.$atts['icon'].'" width="16" height="16" />';
				}
				$newwindow = isset($atts['newwindow']) ? ' target="_blank"' : '';
				$returnhtml = '<p><span class="gdm-drivefile-embed">'.$imghtml.' <a href="'.$url.'"'.$newwindow.'>'.$title.'</a></span></p>';
				break;
			case 'plain':
				$newwindow = isset($atts['newwindow']) ? ' target="_blank"' : '';
				$returnhtml = '<a href="'.$url.'"'.$newwindow.'>'.$title.'</a>';
				break;
			case 'embed':
				$width = isset($atts['width']) ? $atts['width'] : '100%';
				$height = isset($atts['height']) ? $atts['height'] : '400';
				$returnhtml = "<iframe width='${width}' height='${height}' frameborder='0' scrolling='no' src='${url}'></iframe>";
				break;
		}
		if (!is_null($content)) {
			$returnhtml .= do_shortcode($content);
		}
		return $returnhtml.(is_null($content));
	}
	
	// ADMIN
	
	public function gdm_admin_init() {
		global $pagenow;

		// Check Google Apps Login is configured - display warnings if not
		if (apply_filters('gal_get_clientid', '') == '') {
			add_action('admin_notices', Array($this, 'gdm_admin_auth_message'));
			if (is_multisite()) {
				add_action('network_admin_notices', Array($this, 'gdm_admin_auth_message'));
			}
		}
		
		// If on post/page edit screen, set up Add Drive File button
		if (in_array($pagenow, array('post.php', 'page.php', 'post-new.php', 'post-edit.php')) ) {
			add_action( 'admin_head', Array($this, 'gdm_admin_downloads_icon') );
			add_action( 'media_buttons', Array($this, 'gdm_media_button'), 11 );
			add_action( 'admin_enqueue_scripts', Array($this, 'gdm_admin_load_scripts') );
			add_action( 'admin_footer', Array($this, 'gdm_admin_footer') );
		}
	}
	
	public function gdm_admin_auth_message() {
		?>
			<div class="error">
	        	<p>You will need to install and configure 
	        		<a href="http://wp-glogin.com/?utm_source=Admin%20Configmsg&utm_medium=freemium&utm_campaign=Drive" 
	        		target="_blank">Google Apps Login</a>  
	        		plugin in order for Google Drive Media to work. (Requires version 2.0+ of Free or Premium)
	        	</p>
	    	</div> <?php
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

	protected function add_actions() {
		add_filter('gal_gather_scopes', Array($this, 'gdm_gather_scopes') );
		
		add_shortcode( 'google-drive-embed', Array($this, 'gdm_shortcode_display_drivefile') );
		
		if (is_admin()) {
			add_action( 'admin_init', array($this, 'gdm_admin_init') );
		}
	}

}

// Global accessor function to singleton
function GoogleDriveEmbedder() {
	return gdm_google_drive_embedder::get_instance();
}

// Initialise at least once
GoogleDriveEmbedder();

?>