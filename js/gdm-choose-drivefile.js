
// Google Drive Embedder

var gdmDriveMgr = {

	gdmPrevTokenStore : {},
	
	savedWidth : '100%',
	savedHeight : '400',
	
	serviceType : 'drive',
	
	setServiceHandler : function(type) {
		gdmDriveMgr.serviceType = type;
		gdmDriveMgr.gdmClearSearch(); 
	},
	
	getServiceHandler : function() {
		return gdmDriveMgr.serviceType == 'drive' ? gdmDriveServiceHandler : gdmCalendarServiceHandler;
	},
	
	makeApiCall : function(thisPageToken) {
		var self = this;
		
		if (!self.getServiceHandler().getAvailable()) {
			self.gdmStartThinking();
			jQuery('#gdm-thinking-text').html('<p>Embed Google Calendars as well as Drive files<br /> by purchasing the premium or enterprise version of Google Drive Embedder<br/> '
					+'<a href="http://wp-glogin.com/drive/?utm_source=Calendar%20Reason&utm_medium=freemium&utm_campaign=Drive" target="_blank">Find out more</a></p>'
			);
			return;
		}
		
		var current_search_query = gdmDriveMgr.current_search_query;
		var params = {maxResults: 8};
		if (thisPageToken) {
			params.pageToken = thisPageToken;
		}
		if (current_search_query != "") {
			params.q = "title contains '"+current_search_query+"'";
		}
		var restRequest = self.getServiceHandler().getRequest(params);
		self.gdmStartThinking();
		
		restRequest.execute(function(resp) {
			if (resp.error || !resp.items) {
				self.displayError(resp.error);
			}
			else {
				if (!gdmDriveMgr.getServiceHandler().isCorrectType(resp)) {
					return;
				}
				
				self.gdmStopThinking();
				jQuery('#gdm-nextprev-div a').removeAttr('disabled');
	
				var fileslist = document.createDocumentFragment();
				
				if (resp.items.length > 0) {
					for (var i=0 ; i<resp.items.length ; ++i) {
				        fileslist.appendChild(self.gdmMakeListItem(resp.items[i]).get(0));
					}
				}
				else {
				    var htmlItem = jQuery('<div class="gdm-nofiles-div" />');
				    var spanItem = jQuery('<span class="gdm-drivefile-title">No matching Drive files found</span>');
				    
				    if (current_search_query != '') {
				    	spanItem.append(' (<a href="#" id="gdm-search-clear">Clear search</a>)');
				    }
				    
				    htmlItem.append(spanItem);

					fileslist.appendChild( htmlItem.get(0) );
				}
				
				jQuery('#gdm-filelist').empty();
				jQuery('#gdm-filelist').append(fileslist);
				jQuery('.gdm-drivefile-div').click( self.gdmSelectDriveFile );
				
				jQuery('#gdm-search-clear').click( self.gdmClearSearch );
				
				jQuery('#gdm-filelist').show();
				
				// next and prev buttons
				if (resp.nextPageToken) {
					var newNextPageToken = resp.nextPageToken;
					self.gdmPrevTokenStore[newNextPageToken] = thisPageToken;
					jQuery('#gdm-next-link').show().off('click').click(function(event) {
						self.makeApiCall(newNextPageToken);
					});
				}
				else {
					jQuery('#gdm-next-link').hide();
				}
				
				if (thisPageToken && self.gdmPrevTokenStore.hasOwnProperty(thisPageToken)) {
					jQuery('#gdm-prev-link').show().off('click').click(function(event) {
						self.makeApiCall(self.gdmPrevTokenStore[thisPageToken]);
					});
				}
				else {
					jQuery('#gdm-prev-link').hide();
				}
	
				// Disable OK button
				self.gdmNothingSelected();
			}
		});
	},
	
	displayError : function(error) {
		gdmDriveMgr.gdmStartThinking();
		
		if (error.errors && error.errors.length > 0) {
			var serviceName = gdmDriveMgr.serviceType.charAt(0).toUpperCase() + gdmDriveMgr.serviceType.slice(1);
			if (error.errors[0].reason && (error.errors[0].reason == 'accessNotConfigured' || error.errors[0].reason == 'insufficientPermissions')) {
				jQuery('#gdm-thinking-text').html('<p>Please enable <b>'+serviceName+' API</b> on the APIs page in '
						+'<a href="http://cloud.google.com/console" target="_blank">Google Cloud Console</a>'
						+'<br></br> (or reload this page and try again if '+serviceName+' API is already enabled)<br></br>'
						+'</p>'
						+'<p>Error message from Google: <i>'+gdmDriveMgr.escapeHTML(error.errors[0].message)+'</i></p>'
				);
			}
			else if (error.errors[0].reason && (error.errors[0].reason == 'authError' || error.errors[0].reason == 'required')) {
				// Do auth again
				jQuery('#gdm-thinking-text').html('<p>There was a problem accessing <b>'+serviceName+' API</b>'
						+'<br></br>Please <a href="#" onclick="gdmDriveMgr.handleAuthClick2(); return false">click here</a> to authenticate again<br></br>'
						+'</p>'
						+'<p>Error message from Google: <i>'+gdmDriveMgr.escapeHTML(error.errors[0].message)+'</i></p>'
				);				
			}
			else {
				jQuery('#gdm-thinking-text').html('<p>There was a problem accessing <b>'+serviceName+' API</b> '
						+'<br></br>Reload this page and try again - please <a href="mailto:contact@wp-glogin.com">email us</a> if it persists<br></br>'
						+'</p>'
						+'<p>Error message from Google: <i>'+gdmDriveMgr.escapeHTML(error.errors[0].message)+'</i></p>'
				);
			}
		}
	},
	
	gdmMakeListItem : function(drivefile) {
		var links = gdmDriveMgr.getServiceHandler().getUrlsAndReasons(drivefile);
	    
		var attrs = 
			 { 'href': links.viewer.url, 'class': "gdm-file-link",
			  'gdm-data-id': links.id
			  };
		
		gdmDriveMgr.storeFileLinks(links.id, links);
			  
	    var htmlItem = jQuery('<div class="gdm-drivefile-div" />');
	
	    var iconSpan = jQuery('<span class="gdm-drivefile-icon" />')
	    		.append(jQuery( links.icon.url ? '<img src="'+links.icon.url+'" width="16" height="16" '
	    							+ (links.icon.color ? ' style="background-color: '+links.icon.color+'" ' : '') +' />' 
	    						 : '<span style="width: 16px; height: 16px; background-color: '+links.icon.color+'" />' ));
	    var titleSpan = jQuery('<span class="gdm-drivefile-title" />')
	    		.append(jQuery('<a />', attrs )
	    		.text(links.title));
	    
	    htmlItem.append(iconSpan);
	    htmlItem.append(titleSpan);
	    
	    return htmlItem;
	},
	
	
	gdmSelectDriveFile : function(event) {
		var self = jQuery(this);
		
		if (self.hasClass('gdm-selected')) {
			self.removeClass('gdm-selected');
			gdmDriveMgr.gdmNothingSelected();
		}
		else {
			jQuery('.gdm-drivefile-div.gdm-selected').removeClass('gdm-selected');
			self.addClass('gdm-selected');
			
			var anchor = self.find('span.gdm-drivefile-title a');
			
			var id = anchor.attr('gdm-data-id');
			
			var links = gdmDriveMgr.getFileLinks(id);

			gdmDriveMgr.gdmSomethingSelected(links);
		}
		
		event.preventDefault();
		return false;
	},
	
	gdmNothingSelected : function() {
		gdmDriveMgr.hideMoreOptions();
		jQuery('#gdm-insert-drivefile').attr('disabled', 'disabled');
		var baseLinkTypes = jQuery('#gdm-linktypes-div');
		baseLinkTypes.find('input, label').attr('disabled', 'disabled');
		
		jQuery('#gdm-linktype-normal-options').hide();
		jQuery('#gdm-linktype-download-options').hide();
		jQuery('#gdm-linktype-download-reasons').hide();
		jQuery('#gdm-linktype-embed-options').hide();
		jQuery('#gdm-linktype-embed-reasons').hide();
		
		jQuery('#gdm-ack-owner-editor').hide();
	},
	
	gdmSomethingSelected : function(links) {
		//jQuery('#gdm-insert-drivefile').removeAttr('disabled');
		var baseLinkTypes = jQuery('#gdm-linktypes-div');
		baseLinkTypes.find('input, label').removeAttr('disabled');
		
		gdmDriveMgr.hideMoreOptions();
		if (links.extra == 'calendar') {
			jQuery('#gdm-linktype-normal-more').show();
		}
		else {
			jQuery('#gdm-linktype-normal-more').hide();
		}

		jQuery('#gdm-linktype-normal-options').hide();
		
		jQuery('#gdm-linktype-download-options').hide();
		jQuery('#gdm-linktype-download-reasons').hide();
		
		jQuery('#gdm-ack-owner-editor').hide();
	
		if (!links.download.url && !links.download.exports) {
			jQuery('#gdm-linktype-download').attr('gdm-available', 'true');
			
			jQuery('#gdm-linktype-download-reasons').html(' - '+gdmDriveMgr.getServiceHandler().getReasonText(links.download.reason));
		}
		else {
			jQuery('#gdm-linktype-download').attr('gdm-available', 'false');
						
			var fileTypesSelect = jQuery('#gdm-linktype-download-type');
			// Is it a download or an export
			if (links.download.url || !links.download.exports) {
				fileTypesSelect.hide();
			}
			else {
				fileTypesSelect.empty();
				for (prop in links.download.exports) {
					fileTypesSelect.append(jQuery('<option>', { value : links.download.exports[prop] }).text(prop));
				}
				fileTypesSelect.show();
			}
		}

		jQuery('#gdm-linktype-embed-options').hide();
		jQuery('#gdm-linktype-embed-reasons').hide();
		jQuery('.gdm-linktype-embed-folder').hide();
	
		if (!links.embed.url) {
			jQuery('#gdm-linktype-embed').attr('gdm-available', 'true');
			
			jQuery('#gdm-linktype-embed-reasons').html(' - '+gdmDriveMgr.getServiceHandler().getReasonText(links.embed.reason));
		}
		else {
			jQuery('#gdm-linktype-embed').attr('gdm-available', 'false');
						
			if (links.extra == 'calendar' || (links.extra == 'folder' && gdm_trans.allow_non_iframe_folders)) {
				jQuery('#gdm-linktype-embed-more').attr('data-gdm-embed-more-type', links.extra).show();
			}
			else {
				jQuery('#gdm-linktype-embed-more').hide();
			}
			
			if (typeof links.width != 'undefined' && typeof links.height != 'undefined') {
				if (gdmDriveMgr.saveMyDims) {
					gdmDriveMgr.savedWidth = jQuery('#gdm-linktype-embed-width').attr('value');
					gdmDriveMgr.savedHeight = jQuery('#gdm-linktype-embed-height').attr('value');
				}
				jQuery('#gdm-linktype-embed-width').attr('value', links.width);
				jQuery('#gdm-linktype-embed-height').attr('value', links.height);
				gdmDriveMgr.saveMyDims = false;
			}
			else{
				if (gdmDriveMgr.savedWidth) {
					jQuery('#gdm-linktype-embed-width').attr('value', gdmDriveMgr.savedWidth);
				}
				if (gdmDriveMgr.savedHeight) {
					jQuery('#gdm-linktype-embed-height').attr('value', gdmDriveMgr.savedHeight);
				}
				gdmDriveMgr.saveMyDims = true;
			}
			// set width and height

			if (links.extra == 'folder') {
				jQuery('.gdm-linktype-embed-folder').show();
			}

		}
		
		jQuery('.gdm-linktypes-span input:checked').change();
		
		// Enterprise only
		if (gdmDriveMgr.getServiceHandler().showOwnerEditorWarning()) {
			jQuery('#gdm-ack-owner-editor').show();
		}

	},
	
	gdmInsertDriveFile : function() {
		// Send the shortcode to the editor
		var selDiv = jQuery('.gdm-drivefile-div.gdm-selected');
		
		if (selDiv.length > 0) {
			
			if (!gdmDriveMgr.getServiceHandler().allowInsertDriveFile()) {
				return;
			}
			
			var link = selDiv.find('span.gdm-drivefile-title a');
			var url = link.attr('href');
			
			var id = link.attr('gdm-data-id');
			var links = gdmDriveMgr.getFileLinks(id);
			
			var icon = selDiv.find('span.gdm-drivefile-icon img');
			var extraattrs = '';
			
			var linkStyle = '';
			if (jQuery('#gdm-linktype-normal').prop("checked")==true) {
				linkStyle = 'normal';
				if (jQuery('#gdm-linktype-normal-window').prop("checked")) {
					extraattrs = ' newwindow="yes"';
				}
				if (!jQuery('#gdm-linktype-normal-plain').prop("checked")) {
					extraattrs += ' plain="yes"';
				}
			}
			else if (jQuery('#gdm-linktype-download').prop("checked")==true) {
				linkStyle = 'download';
				url = links.download.url;
				
				if (!url && links.download && links.download.exports) {
					url = jQuery('#gdm-linktype-download-type').val();
				}
				
				if (!jQuery('#gdm-linktype-download-plain').prop("checked")) {
					extraattrs += ' plain="yes"';
				}
			}
			else if (jQuery('#gdm-linktype-embed').prop("checked")==true) {
				
				if (links.extra == 'folder' && jQuery('#gdm-foldertype-iframe').prop("checked")==false) {
					// Completely different shortcode type
					if (gdmInsertFolderShortcode) {
						gdmInsertFolderShortcode(links);
						return;
					}
				}
				
				linkStyle = 'embed';
				url = links.embed.url;
				var width = gdmDriveMgr.gdmValidateDimension(jQuery('#gdm-linktype-embed-width').attr('value'), '100%');
				var height = gdmDriveMgr.gdmValidateDimension(jQuery('#gdm-linktype-embed-height').attr('value'), '400');
				extraattrs = ' width="'+width+'" height="'+height+'"';
				if (links.extra) {
					extraattrs += ' extra="'+links.extra+'"';
				}
			}
			
			// Calendar more options
			if ((linkStyle == 'normal' || linkStyle == 'embed') && links.extra && links.extra == 'calendar') {
				var extraparams = {};
				jQuery('.gdm-more-boolean').each(function(index,elt) {
					var jelt = jQuery(elt);
					if (!jelt.prop("checked")) {
						var optname = jelt.attr('name');
						extraparams[optname] = "0";
					}
				});
				extraparams['wkst'] = jQuery('#gdm-more-wkst').val();
				extraparams['mode'] = jQuery('input:radio[name=gdm-more-mode]:checked').val();
				var caltitle = jQuery('#gdm-more-title').val();
				if (caltitle != '') {
					extraparams['title'] = encodeURIComponent(caltitle);
				}
				for (param in extraparams) {
					url += "&" + param + "=" + extraparams[param];
				}
			}
						
			// Send to editor
			window.send_to_editor('[google-drive-embed url="'+url+'" title="'
					+gdmDriveMgr.stripQuots(link.text())+'"'
					+' icon="'+icon.attr('src')+'"'
					+extraattrs
					+' style="'+linkStyle+'"]');
			
			// Set file parent/owner in Enterprise version
			if (gdmDriveMgr.getServiceHandler().allowSetEmbedOwnerParent()) {
				gdmSetEmbedSAOwnerParent(id);
			}

		}
	},
	
	gdmValidateDimension : function(dimStr, defaultStr) {
		if (dimStr.match(/^ *[0-9]+ *(\%|px)? *$/i)) {
			return dimStr.replace(/ /g, '');
		}
		return defaultStr;
	},
	
	gdmNormalCheckChange : function() {
		jQuery('#gdm-insert-drivefile').removeAttr('disabled');
		jQuery('#gdm-linktype-normal-options').show();
		jQuery('#gdm-linktype-download-options').hide();
		jQuery('#gdm-linktype-download-reasons').hide();
		jQuery('#gdm-linktype-embed-options').hide();
		jQuery('#gdm-linktype-embed-reasons').hide();
	},
	
	gdmDownloadCheckChange : function() {
		// Assume it is now checked
		if (jQuery('#gdm-linktype-download').attr('gdm-available') == 'true') {
			jQuery('#gdm-linktype-download-reasons').show();
			jQuery('#gdm-insert-drivefile').attr('disabled', 'disabled');
		} else {
			jQuery('#gdm-linktype-download-options').show();
			jQuery('#gdm-insert-drivefile').removeAttr('disabled');
		}
		jQuery('#gdm-linktype-normal-options').hide();
		jQuery('#gdm-linktype-embed-options').hide();
		jQuery('#gdm-linktype-embed-reasons').hide();
		gdmDriveMgr.hideMoreOptions();
	},
	
	gdmEmbedCheckChange : function() {
		if (jQuery('#gdm-linktype-embed').attr('gdm-available') == 'true') {
			jQuery('#gdm-linktype-embed-reasons').show();
			jQuery('#gdm-insert-drivefile').attr('disabled', 'disabled');
		} else {
			jQuery('#gdm-linktype-embed-options').show();
			jQuery('#gdm-insert-drivefile').removeAttr('disabled');
		}
		jQuery('#gdm-linktype-normal-options').hide();
		jQuery('#gdm-linktype-download-options').hide();
		jQuery('#gdm-linktype-download-reasons').hide();
	},
	
	gdmSearchKeyPress : function(e) {
		if (e.keyCode == 13) {
			gdmDriveMgr.setSearchQuery(jQuery('#gdm-search-box').val());
		}
	},
	
	current_search_query: "",
	
	setSearchQuery : function(str) {
		gdmDriveMgr.current_search_query = str.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
		gdmDriveMgr.makeApiCall();
	},
	
	gdmClearSearch : function() {
		gdmDriveMgr.hideMoreOptions();
		jQuery('#gdm-search-box').val("");
		jQuery('#gdm-search-area').css('visibility', gdmDriveMgr.getServiceHandler().getAllowSearch() ? 'visible' : 'hidden' );
		gdmDriveMgr.setSearchQuery("");
	},
	
	gdmStartThinking : function() {
		jQuery('#gdm-nextprev-div a').attr('disabled', 'disabled').hide();
		jQuery('#gdm-thinking-text').html('Loading...');
		jQuery('.gdm-browsebox').hide();
		jQuery('#gdm-thinking').show();
		gdmDriveMgr.gdmNothingSelected();
	},
	
	gdmStopThinking : function() {
		jQuery('#gdm-thinking').hide();
	},
	
	entityMap : {
		    "&": "&amp;",
		    "<": "&lt;",
		    ">": "&gt;",
		    '"': '&quot;',
		    "'": '&#39;',
		    "/": '&#x2F;'
		  },
	
	escapeHTML : function(str) {		
	    return String(str).replace(/[&<>"'\/]/g, function (s) {
	      return gdmDriveMgr.entityMap[s];
	    });
	},
	
	stripQuots : function(str) {
		return String(str).replace(/["]/g, "'");
	},
	
	_linksStore : {},
	
	storeFileLinks : function(id, links) {
		gdmDriveMgr._linksStore[id] = links;
	},
	
	getFileLinks : function(id) {
		return gdmDriveMgr._linksStore[id];
	},
	
	showMoreOptions : function() {
		if (!jQuery('.gdm-more-options').is(':visible')) {
			jQuery('.gdm-more-options').show();
			
			// folder or calendar
			var extraType = jQuery('#gdm-linktype-embed-more').attr('data-gdm-embed-more-type');
			
			if (extraType == 'folder') {
				jQuery('#gdm-more-options-folders').show();
				jQuery('#gdm-more-options-calendar').hide();
			}
			else {
				jQuery('#gdm-more-options-folders').hide();
				jQuery('#gdm-more-options-calendar').show();
			}
			
			gdmThickDims();
		}
	},

	hideMoreOptions : function() {
		if (jQuery('.gdm-more-options').is(':visible')) {
			jQuery('.gdm-more-options').hide();
			gdmThickDims();
		}		
	},

	// Auth stuff
	
	handleFirstAuth : function(authResult) {
		  if (authResult && !authResult.error) {
			 jQuery('#gdm-search-box').removeAttr('disabled');
			 gdmDriveMgr.makeApiCall();
		  } else {
			  jQuery('#gdm-thinking').hide();
			  jQuery('#gdm-authbtn').show();
		  }	
	},
	
	handleAuthClick2 : function(event) {
		  jQuery('#gdm-authbtn').hide();
		  jQuery('#gdm-filelist').hide();
		  gdmDriveMgr.gdmStartThinking();
		  
		  gdmDriveMgr.doAuth(false, gdmDriveMgr.handleSecondAuth);
	
		  if (event) {
			  event.preventDefault();
		  }
		  return false;
	},
	
	handleSecondAuth : function(authResult) {
		if (authResult && !authResult.error) {
			jQuery('#gdm-search-box').removeAttr('disabled');
			gdmDriveMgr.makeApiCall();
	  } else {
		alert("Failed to authenticate with Google");
		  jQuery('#gdm-authbtn').show();
		  jQuery('#gdm-filelist').hide();
		  jQuery('#gdm-thinking').hide();
	  }	
	},
	
	doAuth : function(immediate, handler) {
		  var clientid = gdm_trans.clientid;
		  
		  if (clientid=='') {
			  jQuery('#gdm-thinking-text').html('<p>Please install and configure '
						+'<a href="http://wp-glogin.com/?utm_source=Admin%20JSmsg&utm_medium=freemium&utm_campaign=Drive" '
						+' target="_blank">Google Apps Login</a>'
						+' plugin first</p><p>Version 2.0 or higher required (Free or Premium)</p>'
			  );
		  }
		  else {
			  var params = {client_id: clientid, scope: gdm_trans.scopes, immediate: immediate,  
	  				   include_granted_scopes: true,
	  				   authuser: -1
	  				   };
			  
			  if (!gdm_trans.gdm_allow_account_switch && gdm_trans.useremail != '') {
				  params.login_hint = gdm_trans.useremail;
		  	  }
			  gapi.auth.authorize(params, handler);
		  }
	},
	
	gdmJsClientLoaded : false,
	
	gdmDocReady : false

};


// Invoked by Google client js file
gdmHandleGoogleJsClientLoad = function() {
	if (gdmDriveMgr.gdmDocReady) {
	   window.setTimeout(
		 function() {
			 gdmDriveMgr.doAuth(true, gdmDriveMgr.handleFirstAuth); 
		 }
		,1);
	}
	else {
		gdmDriveMgr.gdmJsClientLoaded = true;
	}
};

gdmThickDims = function() {
	var tbWidth = 640, tbHeight = 534+50;
	var tbWindow = jQuery('#TB_window'), H = jQuery(window).height(), W = jQuery(window).width(), w, h;

	var moreBox = jQuery('.gdm-more-options:visible');
	if (moreBox.length > 0) {
		tbHeight += moreBox.height();
	}
	
	w = (tbWidth && tbWidth < W - 90) ? tbWidth : W - 90;
	h = (tbHeight && tbHeight < H - 60) ? tbHeight : H - 60;

	if ( tbWindow.size() ) {
		tbWindow.width(w).height(h);
		jQuery('#TB_ajaxContent').width(w).height(h - 31).css('padding', '0');
		tbWindow.css({'margin-left': '-' + parseInt((w / 2),10) + 'px'});
		/* if ( typeof document.body.style.maxWidth !== 'undefined' ) {
			tbWindow.css({'top':'30px','margin-top':'0'});
		}*/
	}
};


jQuery(document).ready(function () {
    jQuery('#gdm-start-browse2').click( gdmDriveMgr.handleAuthClick2 );
    
    jQuery('#gdm-insert-drivefile').click( gdmDriveMgr.gdmInsertDriveFile );
    
    
    jQuery('#gdm-linktype-normal').change( gdmDriveMgr.gdmNormalCheckChange );
    jQuery('#gdm-linktype-download').change( gdmDriveMgr.gdmDownloadCheckChange );
    jQuery('#gdm-linktype-embed').change( gdmDriveMgr.gdmEmbedCheckChange );
    
    jQuery('#gdm-linktype-download-options').hide();
    jQuery('#gdm-linktype-embed-options').hide();
    
    jQuery('#gdm-linktypes-div').find('input, label').attr('disabled', 'disabled');
    
    jQuery('#gdm-search-box').on('keypress', gdmDriveMgr.gdmSearchKeyPress );
    


	jQuery(window).resize( function() { gdmThickDims(); } );
	
	jQuery('#gdm-thickbox-trigger').click( function() { 
			window.setTimeout( function() { 
				gdmThickDims(); 
			}, 1); 
		} );
	
	gdmDriveMgr.gdmDocReady = true;
	if (gdmDriveMgr.gdmJsClientLoaded) {
		// Will have avoided actual auth the first time round, since doc not ready
		gdmHandleGoogleJsClientLoad();
	}
	
	// Extra options
	jQuery('.gdm-linktype-more').click(function() {
		gdmDriveMgr.showMoreOptions();
	});
	
	// Enable tabs
	jQuery('#gdm-tabs').find('a').click(function() {
		jQuery('#gdm-tabs').find('a').removeClass('nav-tab-active');
		jQuery('.gdmtab').removeClass('active');
		var id = jQuery(this).attr('id').replace('-tab','');
		//jQuery('#' + id + '-section').addClass('active');
		jQuery(this).addClass('nav-tab-active');
		gdmDriveMgr.setServiceHandler(id);
	});
	
});

