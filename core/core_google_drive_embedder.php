<?php

class core_google_drive_embedder {
	
	protected function __construct() {
		$this->add_actions();
		register_activation_hook($this->my_plugin_basename(), array( $this, 'gdm_activation_hook' ) );
	}
	
	// May be overridden in basic or premium
	public function gdm_activation_hook($network_wide) {
	}
	
	public function gdm_gather_scopes($scopes) {
		return array_merge($scopes, Array('https://www.googleapis.com/auth/drive.readonly'));
	}

	public function gdm_media_button() {
		global $wp_version;
		$output = '';
		
		if ( version_compare( $wp_version, '3.5', '<' ) ) {
			$img = '<img src="' . $this->my_plugin_url() . 'images/gdm-media.png" alt="Add Google File"/>';
			$output = '<a href="#TB_inline?width=700&height=484&inlineId=gdm-choose-drivefile" id="gdm-thickbox-trigger" class="thickbox" title="Add Google file">' . $img . '</a>';
		} else {
			$img = '<span class="wp-media-buttons-icon" id="gdm-media-button"></span>';
			$output = '<a href="#TB_inline?width=700&height=484&inlineId=gdm-choose-drivefile" id="gdm-thickbox-trigger" class="thickbox button" title="Add Google File" style="padding-left: .4em;">'
					  .$img.' Add Google File</a>';
		}
		echo $output;
	}
	
	public function gdm_admin_load_scripts() {
		$extra_js_name = $this->get_extra_js_name();
		wp_register_script( 'gdm_choose_drivefile_js', $this->my_plugin_url().'js/gdm-choose-drivefile.js', array('jquery', 'gdm_'.$extra_js_name.'_drivefile_js') );
		wp_localize_script( 'gdm_choose_drivefile_js', 'gdm_trans', $this->get_translation_array() );
		wp_enqueue_script( 'gdm_choose_drivefile_js' );
		wp_enqueue_script( 'gdm_'.$extra_js_name.'_drivefile_js', $this->my_plugin_url().'js/gdm-'.$extra_js_name.'-drivefile.js', array('jquery') );
		wp_enqueue_script( 'google-js-api', 'https://apis.google.com/js/client.js?onload=gdmHandleGoogleJsClientLoad', array('gdm_choose_drivefile_js') );
		wp_enqueue_style( 'gdm_choose_drivefile_css', $this->my_plugin_url().'css/gdm-choose-drivefile.css' );
		wp_enqueue_script( 'thickbox' );
		wp_enqueue_style( 'thickbox' );
	}
	
	protected function get_translation_array() {
		// Get Google Client ID
		$clientid = apply_filters('gal_get_clientid', '');
		
		// Get current user's email address
		$current_user = wp_get_current_user();
		$email = $current_user ? $current_user->user_email : '';
		
		return Array( 'scopes' => implode(' ', $this->gdm_gather_scopes(Array()) ),
					  'clientid' => $clientid,
					  'useremail' => $email,
					  'allow_non_iframe_folders' => $this->allow_non_iframe_folders());
	}
	
	protected function get_extra_js_name() {
		return '';
	}
	
	public function gdm_admin_footer() {
		?>
		<div id="gdm-choose-drivefile" style="display: none;">
			<h3 id="gdm-tabs" class="nav-tab-wrapper">
				<a href="#drive" id="drive-tab" class="nav-tab nav-tab-active">Drive</a>
				<a href="#calendar" id="calendar-tab" class="nav-tab"><?php echo $this->get_extra_js_name() == 'basic' ? '+' : 'Calendar'; ?></a>
			</h3>
			
			<div class="wrap gdm-wrap">
				
				<div id="gdm-search-area">
					<input type="text" id="gdm-search-box" placeholder="Enter text to search (then press Enter)" disabled="disabled"></input>
				</div>
			
				<div id="gdm-thinking" class="gdm-browsebox" style="display: none;">
					<div id="gdm-thinking-text">Loading...</div>
				</div>
				
				<div id="gdm-authbtn" class="gdm-browsebox">
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
							<input type="radio" name="gdm-linktypes" id="gdm-linktype-normal" />
							<label for="gdm-linktype-normal">Viewer file link</label>
						</span>
						<span id="gdm-linktype-normal-options" class="gdm-linktype-options">
							<input type="checkbox" id="gdm-linktype-normal-plain" checked="checked" /> 
							<label for="gdm-linktype-normal-plain">Show icon</label>
						
							&nbsp; &nbsp; &nbsp; &nbsp;
							<input type="checkbox" id="gdm-linktype-normal-window" checked="checked" /> 
							<label for="gdm-linktype-normal-window">Open in new window</label>
							
							&nbsp; &nbsp;
							<a href="#" id="gdm-linktype-normal-more" style="display: none;" class="gdm-linktype-more">Options...</a>
						</span>
					</div>
					
					<div class="gdm-downloadable-only">
						<span class="gdm-linktypes-span">
							<input type="radio" name="gdm-linktypes" id="gdm-linktype-download" />
							<label for="gdm-linktype-download">Download file link
								<span id="gdm-linktype-download-reasons"></span>
							</label>
						</span>
						<span id="gdm-linktype-download-options" class="gdm-linktype-options">
							<select name="gdm-linktype-download-type" id="gdm-linktype-download-type"></select>
							 &nbsp; &nbsp;
							<input type="checkbox" id="gdm-linktype-download-plain" checked="checked" /> 
							<label for="gdm-linktype-download-plain">Show icon</label>
						</span>
					</div>
					
					<div class="gdm-embeddable-only">
						<span class="gdm-linktypes-span">
							<input type="radio" name="gdm-linktypes" id="gdm-linktype-embed" checked="checked" />
							<label for="gdm-linktype-embed">Embed document
								<span id="gdm-linktype-embed-reasons"></span>
							</label>
						</span>
						
						<span id="gdm-linktype-embed-options" class="gdm-linktype-options">
							<label for="gdm-linktype-embed-width">Width</label> <input type="text" id="gdm-linktype-embed-width" size="7" value="100%" />
							&nbsp; &nbsp;
							<label for="gdm-linktype-embed-height">Height</label> <input type="text" id="gdm-linktype-embed-height" size="7" value="400" />
							&nbsp; &nbsp;
							<a href="#" id="gdm-linktype-embed-more" style="display: none;" class="gdm-linktype-more">Options...</a>
						</span>
					</div> 

				</div>

				<?php $this->admin_footer_extra(); ?>
				
				<p class="submit">
					<input type="button" id="gdm-insert-drivefile" class="button-primary" 
							value="Insert File" disabled="disabled" />
					<a id="gdm-cancel-drivefile-insert" class="button-secondary" onclick="tb_remove();" title="Cancel">Cancel</a>
					
					<span id="gdm-ack-owner-editor" style="display: none;">
					<input type="checkbox" id="gdm-ack-owner-editor-checkbox" class="gdm-ack-owner-editor" />
					<label for="gdm-ack-owner-editor-checkbox">I acknowledge that I will be demoted from owner to editor</label>
					</span>
				</p>
				
			</div>
		</div>
		<?php
	}
	
	protected function allow_non_iframe_folders() {
		return false;
	}
	
	// Extended in premium
	protected function admin_footer_extra() {
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
			return '<b>google-drive-embed requires a url attribute</b>';
		}
		$url = $atts['url'];
		$title = isset($atts['title']) ? $atts['title'] : $url; // Should be html-encoded already
		
		$linkstyle = isset($atts['style']) && in_array($atts['style'], Array('normal', 'plain', 'download', 'embed')) 
						? $atts['style'] : 'normal';
		$returnhtml = '';
		switch ($linkstyle) {
			case 'normal':
			case 'download':
			case 'plain':
				$imghtml = '';
				if (isset($atts['icon'])) {
					$imghtml = '<img src="'.$atts['icon'].'" width="16" height="16" />';
				}
				$newwindow = isset($atts['newwindow']) && $atts['newwindow']=='yes' ? ' target="_blank"' : '';
				$ahref = '<a href="'.$url.'"'.$newwindow.'>'.$title.'</a>';
				if ((isset($atts['plain']) && $atts['plain']=='yes') || $linkstyle=='plain') {
					$returnhtml = $ahref;
				}
				else {
					$returnhtml = '<p><span class="gdm-drivefile-embed">'.$imghtml.' '.$ahref.'</span></p>';
				}
				break;
			case 'embed':
				$width = isset($atts['width']) ? $atts['width'] : '100%';
				$height = isset($atts['height']) ? $atts['height'] : '400';
				$scrolling = isset($atts['scrolling']) && strtolower($atts['scrolling']) == 'yes' ? 'yes' : 'no';
				$returnhtml = "<iframe width='${width}' height='${height}' frameborder='0' scrolling='".$scrolling."' src='${url}'></iframe>";
				break;
		}
		if (!is_null($content)) {
			$returnhtml .= do_shortcode($content);
		}
		return $returnhtml;
	}
	
	// ADMIN OPTIONS
	// *************
	
	protected function get_options_menuname() {
		return 'gdm_list_options';
	}
	
	protected function get_options_pagename() {
		return 'gdm_options';
	}
	
	protected function get_settings_url() {
		return is_multisite()
		? network_admin_url( 'settings.php?page='.$this->get_options_menuname() )
		: admin_url( 'options-general.php?page='.$this->get_options_menuname() );
	}
	
	public function gdm_admin_menu() {
		if (is_multisite()) {
			add_submenu_page( 'settings.php', 'Google Drive Embedder settings', 'Google Drive Embedder',
			'manage_network_options', $this->get_options_menuname(),
			array($this, 'gdm_options_do_page'));
		}
		else {
			add_options_page( 'Google Drive Embedder settings', 'Google Drive Embedder',
			'manage_options', $this->get_options_menuname(),
			array($this, 'gdm_options_do_page'));
		}
	}
	
	public function gdm_options_do_page() {
	
		$submit_page = is_multisite() ? 'edit.php?action='.$this->get_options_menuname() : 'options.php';
	
		if (is_multisite()) {
			$this->gdm_options_do_network_errors();
		}
		?>
			  
		<div>
		
		<h2>Google Drive Embedder setup</h2>
		
		<?php $this->output_instructions_button(); ?>
		
		<div id="gdm-tablewrapper">

		<?php $this->draw_admin_settings_tabs(); ?>
		
		<form action="<?php echo $submit_page; ?>" method="post" id="gdm_form">
		
		<?php 
		settings_fields($this->get_options_pagename());

		$this->gdm_extrasection_text();
		
		$this->gdm_mainsection_text();
		
		$this->gdm_options_submit();
		?>
				
		</form>
		</div>
		
		</div>  <?php
	}

	// Override in Enterprise
	protected function output_instructions_button() {
	}
	
	// Override in professional
	protected function draw_admin_settings_tabs() {
	}
	
	protected function gdm_options_submit() {
	?>
		<p class="submit">
			<input type="submit" value="Save Changes" class="button button-primary" id="submit" name="submit">
		</p>
	<?php
	}
	
	// Extended in basic and premium
	protected function gdm_mainsection_text() {
	}
	protected function gdm_extrasection_text() {
	}
	
	public function gdm_options_validate($input) {
		$newinput = Array();
		$newinput['gdm_version'] = $this->PLUGIN_VERSION;
		return $newinput;
	}
	
	protected function get_error_string($fielderror) {
		return 'Unspecified error';
	}
	
	public function gdm_save_network_options() {
		check_admin_referer( $this->get_options_pagename().'-options' );
	
		if (isset($_POST[$this->get_options_name()]) && is_array($_POST[$this->get_options_name()])) {
			$inoptions = $_POST[$this->get_options_name()];
			
			$outoptions = $this->gdm_options_validate($inoptions);
			
			$error_code = Array();
			$error_setting = Array();
			foreach (get_settings_errors() as $e) {
				if (is_array($e) && isset($e['code']) && isset($e['setting'])) {
					$error_code[] = $e['code'];
					$error_setting[] = $e['setting'];
				}
			}
	
			update_site_option($this->get_options_name(), $outoptions);
				
			// redirect to settings page in network
			wp_redirect(
			add_query_arg(
			array( 'page' => $this->get_options_menuname(),
			'updated' => true,
			'error_setting' => $error_setting,
			'error_code' => $error_code ),
			network_admin_url( 'admin.php' )
			)
			);
			exit;
		}
	}
	
	protected function gdm_options_do_network_errors() {
		if (isset($_REQUEST['updated']) && $_REQUEST['updated']) {
			?>
					<div id="setting-error-settings_updated" class="updated settings-error">
					<p>
					<strong>Settings saved</strong>
					</p>
					</div>
				<?php
			}
	
			if (isset($_REQUEST['error_setting']) && is_array($_REQUEST['error_setting'])
				&& isset($_REQUEST['error_code']) && is_array($_REQUEST['error_code'])) {
				$error_code = $_REQUEST['error_code'];
				$error_setting = $_REQUEST['error_setting'];
				if (count($error_code) > 0 && count($error_code) == count($error_setting)) {
					for ($i=0; $i<count($error_code) ; ++$i) {
						?>
					<div id="setting-error-settings_<?php echo $i; ?>" class="error settings-error">
					<p>
					<strong><?php echo htmlentities2($this->get_error_string($error_setting[$i].'|'.$error_code[$i])); ?></strong>
					</p>
					</div>
						<?php
				}
			}
		}
	}
	
	// OPTIONS
	
	protected function get_default_options() {
		return Array('gdm_version' => $this->PLUGIN_VERSION);
	}
	
	protected $gdm_options = null;
	protected function get_option_gdm() {
		if ($this->gdm_options != null) {
			return $this->gdm_options;
		}
	
		$option = get_site_option($this->get_options_name(), Array());
	
		$default_options = $this->get_default_options();
		foreach ($default_options as $k => $v) {
			if (!isset($option[$k])) {
				$option[$k] = $v;
			}
		}
	
		$this->gdm_options = $option;
		return $this->gdm_options;
	}
	
	// ADMIN
	
	public function gdm_admin_init() {
		register_setting( $this->get_options_pagename(), $this->get_options_name(), Array($this, 'gdm_options_validate') );

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
	        		<a href="http://wp-glogin.com/google-apps-login-premium/?utm_source=Admin%20Configmsg&utm_medium=freemium&utm_campaign=Drive" 
	        		target="_blank">Google Apps Login</a>  
	        		plugin in order for Google Drive Embedder to work. (Requires v2.5.2+ of Free or Professional)
	        	</p>
	    	</div> <?php
		}


	protected function add_actions() {
		add_filter('gal_gather_scopes', Array($this, 'gdm_gather_scopes') );
		
		add_shortcode( 'google-drive-embed', Array($this, 'gdm_shortcode_display_drivefile') );
		
		if (is_admin()) {
			add_action( 'admin_init', array($this, 'gdm_admin_init'), 5, 0 );
			
			add_action(is_multisite() ? 'network_admin_menu' : 'admin_menu', array($this, 'gdm_admin_menu'));
			
			if (is_multisite()) {
				add_action('network_admin_edit_'.$this->get_options_menuname(), array($this, 'gdm_save_network_options'));
			}
		}
	}

}


class gdm_Drive_Exception extends Exception {

}

?>