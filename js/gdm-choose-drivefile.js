
// Google Drive Embedder

var gdmDriveMgr = {

	gdmPrevTokenStore : {},
	
	savedWidth : '',
	savedHeight : '',
	
	makeApiCall : function(thisPageToken) {
		var self = this;
		var current_search_query = gdmDriveMgr.current_search_query;
		var params = {maxResults: 8, trashed: false};
		if (thisPageToken) {
			params.pageToken = thisPageToken;
		}
		if (current_search_query != "") {
			params.q = "title contains '"+current_search_query+"'";
		}
		var restRequest = gapi.client.request({
			  'path': '/drive/v2/files',
			  'params': params
			});
		self.gdmStartThinking();
		jQuery('#gdm-nextprev-div a').attr('disabled', 'disabled');
		
		restRequest.execute(function(resp) {
			if (resp.error || !resp.items) {
				self.gdmStartThinking();
				jQuery('#gdm-thinking-text').html('<p>Please enable <b>Drive API</b> on the APIs page in '
						+'<a href="http://cloud.google.com/console" target="_blank">Google Cloud Console</a>'
						+'<br></br> (or reload this page and try again if Drive API is already enabled)<br></br>'
						+'</p>'
						+'<p>Error message from Google: <i>'+self.escapeHTML(resp.error.message)+'</i></p>'
				);
			}
			else {
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
	
	gdmMakeListItem : function(drivefile) {
		var links = gdmDriveFileHandler.getUrlsAndReasons(drivefile);
	    
		var attrs = 
			 { 'href': links.viewer.url, 'class': "gdm-file-link",
			  'gdm-data-embedurl': links.embed.url,
			  'gdm-data-downloadurl': links.download.url
			  };
		
		if (links.embed.reason) {
			attrs['gdm-data-embedreason'] = links.embed.reason;
		}
		if (links.extra) {
			attrs['gdm-data-extra'] = links.extra;
		}
		if (links.width) {
			attrs['gdm-data-width'] = links.width;
		}
		if (links.height) {
			attrs['gdm-data-height'] = links.height;
		}
			  
	    var htmlItem = jQuery('<div class="gdm-drivefile-div" />');
	
	    var iconSpan = jQuery('<span class="gdm-drivefile-icon" />')
	    		.append(jQuery('<img src="'+drivefile.iconLink+'" width="16" height="16" />'));
	    var titleSpan = jQuery('<span class="gdm-drivefile-title" />')
	    		.append(jQuery('<a />', attrs )
	    		.text(drivefile.title));
	    
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
			var embedurl = anchor.attr('gdm-data-embedurl');
			var downloadurl = anchor.attr('gdm-data-downloadurl');
			var embedreason = anchor.attr('gdm-data-embedreason');
			var width = anchor.attr('gdm-data-width');
			var height = anchor.attr('gdm-data-height');
			gdmDriveMgr.gdmSomethingSelected(downloadurl != '', embedurl != '', embedreason, width, height);
		}
		
		event.preventDefault();
		return false;
	},
	
	gdmNothingSelected : function() {
		jQuery('#gdm-insert-drivefile').attr('disabled', 'disabled');
		var baseLinkTypes = jQuery('#gdm-linktypes-div');
		baseLinkTypes.find('input, label').attr('disabled', 'disabled');
		jQuery('#gdm-linktype-embed-reasons').hide();
	},
	
	gdmSomethingSelected : function(canDownload, canEmbed, embedreason, width, height) {
		jQuery('#gdm-insert-drivefile').removeAttr('disabled');
		var baseLinkTypes = jQuery('#gdm-linktypes-div');
		baseLinkTypes.find('input, label').removeAttr('disabled');
	
		if (!canDownload) {
			baseLinkTypes.find('.gdm-downloadable-only').find('input, label').attr('disabled', 'disabled');
			if (jQuery('#gdm-linktype-download').prop("checked")==true) {
				jQuery('#gdm-linktype-normal').prop("checked", true);
				jQuery('#gdm-linktype-normal-options').show();
				jQuery('#gdm-linktype-download-options').hide();
			}
		}
		
		if (!canEmbed) {
			// baseLinkTypes minus embed ones
			baseLinkTypes.find('.gdm-embeddable-only').find('input, label').attr('disabled', 'disabled');
			if (jQuery('#gdm-linktype-embed').prop("checked")==true) {
				jQuery('#gdm-linktype-normal').prop("checked", true);
				jQuery('#gdm-linktype-normal-options').show();
				jQuery('#gdm-linktype-embed-options').hide();
			}
			jQuery('#gdm-linktype-embed-reasons').show();
			jQuery('#gdm-linktype-embed-reasons').html(' - '+gdmDriveFileHandler.getReasonText(embedreason));
		}
		else {
			jQuery('#gdm-linktype-embed-reasons').hide();
			if (width) {
				gdmDriveMgr.savedWidth = jQuery('#gdm-linktype-embed-width').attr('value');
				jQuery('#gdm-linktype-embed-width').attr('value', width);
			}
			else if (gdmDriveMgr.savedWidth) {
				jQuery('#gdm-linktype-embed-width').attr('value', gdmDriveMgr.savedWidth);
			}
			
			if (height) {
				gdmDriveMgr.savedHeight = jQuery('#gdm-linktype-embed-height').attr('value');
				jQuery('#gdm-linktype-embed-height').attr('value', height);
			}
			else if (gdmDriveMgr.savedHeight) {
				jQuery('#gdm-linktype-embed-height').attr('value', gdmDriveMgr.savedHeight);
			}
			// set width and height
		}
	},
	
	gdmInsertDriveFile : function() {
		// Send the shortcode to the editor
		var selDiv = jQuery('.gdm-drivefile-div.gdm-selected');
		
		if (selDiv.length > 0) {
			var link = selDiv.find('span.gdm-drivefile-title a');
			var url = link.attr('href');
			
			var icon = selDiv.find('span.gdm-drivefile-icon img');
			var extraattrs = '';
			
			var linkStyle = '';
			if (jQuery('#gdm-linktype-normal').prop("checked")==true) {
				linkStyle = 'normal';
				if (jQuery('#gdm-linktype-normal-window').prop("checked")) {
					extraattrs = ' newwindow="yes"';
				}
				if (jQuery('#gdm-linktype-normal-plain').prop("checked")) {
					extraattrs += ' plain="yes"';
				}
			}
			else if (jQuery('#gdm-linktype-download').prop("checked")==true) {
				linkStyle = 'download';
				url = link.attr('gdm-data-downloadurl');
				if (jQuery('#gdm-linktype-download-plain').prop("checked")) {
					extraattrs += ' plain="yes"';
				}
			}
			else if (jQuery('#gdm-linktype-embed').prop("checked")==true) {
				linkStyle = 'embed';
				url = link.attr('gdm-data-embedurl');
				var width = gdmDriveMgr.gdmValidateDimension(jQuery('#gdm-linktype-embed-width').attr('value'), '100%');
				var height = gdmDriveMgr.gdmValidateDimension(jQuery('#gdm-linktype-embed-height').attr('value'), '400');
				extraattrs = ' width="'+width+'" height="'+height+'"';
				extra = link.attr('gdm-data-extra');
				if (extra != '') {
					extraattrs += ' extra="'+extra+'"';
				}
			}
			
			window.send_to_editor('[google-drive-embed url="'+url+'" title="'
					+gdmDriveMgr.stripQuots(link.text())+'"'
					+' icon="'+icon.attr('src')+'"'
					+extraattrs
					+' style="'+linkStyle+'"]');
		}
	},
	
	gdmValidateDimension : function(dimStr, defaultStr) {
		if (dimStr.match(/^ *[0-9]+ *(\%|px)? *$/i)) {
			return dimStr.replace(/ /g, '');
		}
		return defaultStr;
	},
	
	gdmNormalCheckChange : function() {
		if (jQuery(this).attr('value')) {
			jQuery('#gdm-linktype-normal-options').show();
			jQuery('#gdm-linktype-download-options').hide();
			jQuery('#gdm-linktype-embed-options').hide();
		}
		else {
			jQuery('#gdm-linktype-normal-options').hide();
		}
	},
	
	gdmDownloadCheckChange : function() {
		if (jQuery(this).attr('value')) {
			jQuery('#gdm-linktype-download-options').show();
			jQuery('#gdm-linktype-normal-options').hide();
			jQuery('#gdm-linktype-embed-options').hide();
		}
		else {
			jQuery('#gdm-linktype-download-options').hide();
		}
	},
	
	gdmEmbedCheckChange : function() {
		if (jQuery(this).attr('value')) {
			jQuery('#gdm-linktype-embed-options').show();
			jQuery('#gdm-linktype-download-options').hide();
			jQuery('#gdm-linktype-normal-options').hide();
		}
		else {
			jQuery('#gdm-linktype-embed-options').hide();
		}
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
		jQuery('#gdm-search-box').val("");
		gdmDriveMgr.setSearchQuery("");
	},
	
	gdmStartThinking : function() {
		jQuery('.gdm-browsebox').hide();
		jQuery('#gdm-thinking').show();
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
		  jQuery('#gdm-thinking').show();
		  
		  gdmDriveMgr.doAuth(false, gdmDriveMgr.handleSecondAuth);
	
		  event.preventDefault();
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
		  var clientid = jQuery('#gdm-clientid').val();
		  
		  if (clientid=='') {
			  jQuery('#gdm-thinking-text').html('<p>Please install and configure '
						+'<a href="http://wp-glogin.com/?utm_source=Admin%20JSmsg&utm_medium=freemium&utm_campaign=Drive" '
						+' target="_blank">Google Apps Login</a>'
						+' plugin first</p><p>Version 2.0 or higher required (Free or Premium)</p>'
			  );
		  }
		  else {
			  var useremail = jQuery('#gdm-useremail').val();
			  var scopes = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file';
			  
			  gapi.auth.authorize({client_id: clientid, scope: scopes, immediate: immediate, login_hint: useremail, 
					  				   include_granted_scopes: true}, handler);
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
    
	thickDims = function() {
		var tbWidth = 640, tbHeight = 534;
		var tbWindow = jQuery('#TB_window'), H = jQuery(window).height(), W = jQuery(window).width(), w, h;

		w = (tbWidth && tbWidth < W - 90) ? tbWidth : W - 90;
		h = (tbHeight && tbHeight < H - 60) ? tbHeight : H - 60;

		if ( tbWindow.size() ) {
			tbWindow.width(w).height(h);
			jQuery('#TB_ajaxContent').width(w).height(h - 27);
			tbWindow.css({'margin-left': '-' + parseInt((w / 2),10) + 'px'});
			/* if ( typeof document.body.style.maxWidth !== 'undefined' ) {
				tbWindow.css({'top':'30px','margin-top':'0'});
			}*/
		}
	};

	jQuery(window).resize( function() { thickDims(); } );
	
	jQuery('#gdm-thickbox-trigger').click( function() { 
			window.setTimeout( function() { 
					thickDims(); 
			}, 1); 
		} );
	
	
	gdmDriveMgr.gdmDocReady = true;
	if (gdmDriveMgr.gdmJsClientLoaded) {
		// Will have avoided actual auth the first time round, since doc not ready
		gdmHandleGoogleJsClientLoad();
	}
	
});

