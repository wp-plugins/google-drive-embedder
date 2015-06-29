
var gdmDriveServiceHandler = {
		
	getAvailable : function() {return true;},
	
	allowSetEmbedOwnerParent : function() {return false;},
	showOwnerEditorWarning : function() {return false;},
	allowInsertDriveFile : function() {return true;},
		
	getRequest : function(params) {
		params.trashed = false;
		return gapi.client.request({
			  'path': '/drive/v2/files',
			  'params': params
			});
	},
	
	isCorrectType : function(resp) {
		return resp.kind == 'drive#fileList';
	},
	
	getAllowSearch : function() { return true; },
	
	getUrlsAndReasons : function(drivefile) {
		if (drivefile.kind != 'drive#file') {
			return {};
		}
		
		var links = {
				id : drivefile.id,
				embed : { url : '', reason : '' },
				viewer : { url : drivefile.alternateLink ? drivefile.alternateLink : '', reason : '' },
				download : { url : drivefile.webContentLink ? drivefile.webContentLink : '' , reason : '' },
				title : drivefile.title,
				icon: { url : drivefile.iconLink }
		};
		
		if (drivefile.embedLink) {
			links.embed.url = drivefile.embedLink;
		}
		else {
			if (drivefile.mimeType == 'application/vnd.google-apps.folder' || drivefile.mimeType == 'application/vnd.google-apps.form' || drivefile.mimeType.match(/^image\//)) {
				links.embed.reason = 'PREMIUM';
				links.download.reason = 'FOLDERDOWNLOAD';
			}
			else {
				if (drivefile.alternateLink) {
					links.embed.url = drivefile.alternateLink.replace(/\/(edit|view)(\?|$)/g, '/preview?');
				}
				else if (drivefile.webContentLink) {
					// Old-style Google Doc Viewer as fallback
					links.embed.url = '//docs.google.com/viewer?embedded=true&url=' + encodeURIComponent(drivefile.webContentLink);
				}
				else {
					links.embed.reason = 'WEBCONTENT';
				}
			}
		}
		
		// Video needs special attention
		if (drivefile.mimeType.match(/^video\//) && drivefile.alternateLink) {
			links.embed.url = '';
			links.embed.reason = "PREMIUM";
		}
		
		if (links.download.url == '' && drivefile.exportLinks) {
			links.download.reason = "PREMIUM";
		}
	    
	    return links;
	},
	
	getReasonText : function(reason) {
		switch (reason) {
			case 'SHARE':
				return 'To enable embedding, set Sharing to \'Anyone with the link can view\'';
				break;
				
			case 'PREMIUM':
				return 'Please purchase a paid version to enable this file type '
						+'(<a href="http://wp-glogin.com/drive/?utm_source=Embed%20Reason&utm_medium=freemium&utm_campaign=Drive" '
						+'target="_blank">Find out more</a>)';
				break;
				
			case 'FOLDERDOWNLOAD':
				return 'Not possible to download this type';
				break;
				
			case 'WEBCONTENT':
				return 'There is no content available';
				break;
				
			default:
				return 'Not possible for this file type';
		}
	}

};


var gdmCalendarServiceHandler = {
		
	getAvailable : function() {return false;},
	
	allowSetEmbedOwnerParent : function() {return false;},
	showOwnerEditorWarning : function() {return false;},
	allowInsertDriveFile : function() {return false;},
	
	getAllowSearch : function() { return false; },
	
	isCorrectType : function(resp) {
		return resp.kind == 'calendar#calendarList';
	},
	
	getUrlsAndReasons : function(calendar) {
		return {};
	}

};
