
var gdmDriveFileHandler = {
	getUrlsAndReasons : function(drivefile) {
		var links = {
				embed : { url : '', reason : '' },
				viewer : { url : drivefile.alternateLink ? drivefile.alternateLink : '', reason : '' },
				download : { url : drivefile.webContentLink ? drivefile.webContentLink : '' , reason : '' }
		};
		
		if (drivefile.embedLink) {
			links.embed.url = drivefile.embedLink;
		}
		else {
			if (drivefile.mimeType == 'application/vnd.google-apps.folder' || drivefile.mimeType.match(/^image\//)) {
				links.embed.reason = 'PREMIUM';
			}
			else {
				if (drivefile.webContentLink) {
					if (drivefile.shared) {
						links.embed.url = '//docs.google.com/viewer?embedded=true&url=' + encodeURIComponent(drivefile.webContentLink);
					}
					else {
						links.embed.reason = 'SHARE';
					}
				}
				else {
					links.embed.reason = 'WEBCONTENT';
				}
			}
		}
	    
	    return links;
	},
	
	getReasonText : function(reason) {
		switch (reason) {
			case 'SHARE':
				return 'To enable embedding, set Sharing to \'Anyone with the link can view\'';
				break;
				
			case 'PREMIUM':
				return 'Requires PREMIUM version to embed this file type '
						+'(<a href="http://wp-glogin.com/drive/?utm_source=Embed%20Reason&utm_medium=freemium&utm_campaign=Drive" '
						+'target="_blank">Find out more</a>)';
				break;
				
			default:
				return 'You cannot embed this file type';
		}
	}

};
