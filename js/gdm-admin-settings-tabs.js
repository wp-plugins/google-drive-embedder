
// Do tabs

jQuery(document).ready(function() {
	
	function gdmSetActionToTab(id) {
		var frm = jQuery('#gdm_form');
		frm.attr('action', frm.attr('action').replace(/(#.+)?$/, '#'+id) );
	}

	jQuery('#gdm-tabs').find('a').click(function() {
			jQuery('#gdm-tabs').find('a').removeClass('nav-tab-active');
			jQuery('.gdmtab').removeClass('active');
			var id = jQuery(this).attr('id').replace('-tab','');
			jQuery('#' + id + '-section').addClass('active');
			jQuery(this).addClass('nav-tab-active');
			
			// Set submit URL to this tab
			gdmSetActionToTab(id);
	});
	
	// Did page load with a tab active?
	var active_tab = window.location.hash.replace('#','');
	if (active_tab == '') {
		active_tab = jQuery('#gdm-tabs a').first().attr('id').replace('-tab','');
	}
	var activeSection = jQuery('#' + active_tab + '-section');
	var activeTab = jQuery('#' + active_tab + '-tab');

	if (activeSection && activeTab) {
		jQuery('#gdm-tabs').find('a').removeClass('nav-tab-active');
		jQuery('.gdmtab').removeClass('active');

		activeSection.addClass('active');
		activeTab.addClass('nav-tab-active');
		gdmSetActionToTab(active_tab);
	}

	
});