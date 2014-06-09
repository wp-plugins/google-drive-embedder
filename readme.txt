=== Plugin Name ===
Contributors: danlester
Tags: drive, google, document, google apps, google drive, sso, single-sign-on, auth, intranet, embed
Requires at least: 3.3
Tested up to: 3.9
Stable tag: 2.3
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Browse for Google Drive documents and embed directly in your posts/pages. Extends Google Apps Login plugin so no extra user auth required.

== Description ==

Google Drive Embedder gives authors easy access to their Google Drive in a popup box, where they can select documents to embed directly into their post or page. Just as easily as picking a photo from the WordPress media gallery.

Documents can be embedded in-line, using Google's read-only interactive viewer for your audience to read them. Documents can also be placed in your site as links to open up editable files (either in the same or a new browser tab), or downloaded straight to the computer.

You will need to set document sharing settings to ensure your website viewers have access to view your documents (e.g. at least 'anyone with the link can view' to be visible to all visitors).

**This plugin requires that you also install the free (or premium) version of the popular [Google Apps Login](http://wp-glogin.com/wpgoogleappslogin) plugin**

Now displays many file types such as PDF, Word DOC, ZIP etc plus native Google docs (Spreadsheet, Drawing, etc).

Choose from:
 
*  Viewer file link - full page Google viewer and editor
*  Download file link - directly download file to your computer (disabled for native Google doc formats)
*  Embed document - display most file types inline in your posts or pages (non-Google file types need sharing settings at least 'anyone with the link can view')

Useful for public websites or private intranets (all visitors should be able to view files as long as sharing settings are 'anyone with the link can view' or higher in Google Drive). 
Works on all WordPress installations including multisite networks.

= Premium version and Support =

You can also purchase the premium version of the plugin for some important extra features:

* Google Calendars: pick from your Google Calendars and provide download links to ICAL or XML, or embed them directly in your site.
* Google Docs export: provide links to downloadable versions of Google Docs, e.g. Spreadsheets exported as PDF or Excel.
* Embed Folders: simply keep your Google Drive folder up-to-date with your files, and your staff or website visitors will always be able to view a list of the latest documents.
* Embed Images: serve them directly from Google Drive, respecting your Google sharing settings.
* Support and updates for one year.

Visit our website for pricing and purchase details: 
[http://wp-glogin.com/drive/](http://wp-glogin.com/drive/?utm_source=Drive%20ReadmePromo&utm_medium=freemium&utm_campaign=Freemium)

= Requirements =

Google Drive document embedding and one-click login will work for the following domains and user accounts:

*  Google Apps for Business
*  Google Apps for Education
*  Google Apps for Non-profits
*  Personal gmail.com and googlemail.com emails

Google Apps Login plugin setup requires you to have admin access to any Google Apps domain, or a regular Gmail account, to register and
obtain two simple codes from Google.

= Google Apps Login =

The [Google Apps Login](http://wp-glogin.com/wpgoogleappslogin) plugin (which you must also install) 
allows existing Wordpress user accounts to login to the website 
using Google to securely authenticate their account. This means that if they are already logged into Gmail for example,
they can simply click their way through the Wordpress login screen - no username or password is explicitly required!

Full support and premium features are also available for purchase:

Eliminate the need for Google Apps domain admins to  separately manage WordPress user accounts, and get piece 
of mind that only authorized employees have access to the organizations's websites and intranet.

**See [http://wp-glogin.com/](http://wp-glogin.com/?utm_source=Drive%20Readme&utm_medium=freemium&utm_campaign=Freemium)**


== Screenshots ==

1. Insert Drive File button is added to post/page admin screen 
2. Browse for your Google Drive files and select how to embed
3. Read-only documents can be embedded in the browser...
4. ...or links to open editable documents in a new tab

== Frequently Asked Questions ==

= How can I obtain support for this product? =

Full support is available if you purchase the premium license from the author via:
[https://wp-glogin.com/drive/](https://wp-glogin.com/drive/?utm_source=Drive%20Readme%20Premium&utm_medium=freemium&utm_campaign=Freemium)

The premium plugin also supports more file types (such as embedded Videos and Drive Folders) and allows you to 
browse your Google Calendars to embed in your posts/pages.

Please feel free to email [support@wp-glogin.com](mailto:support@wp-glogin.com) with any questions (specifying Drive in the subject),
as we may be able to help, but you may be required to purchase a support license if the problem
is specific to your installation or requirements.

We may occasionally be able to respond to support queries posted on the 'Support' forum here on the wordpress.org
plugin page, but we recommend sending us an email instead if possible.

= Why is the option for Viewer / Download / Embed disabled for some files? =

Download isn't normally enabled for native Google file types.

Embed should be enabled for many non-native file types (e.g. PDF, Word DOC). If not, you may need to increase sharing 
settings within Google Drive to 'anyone with the link may view', or higher.

If that still doesn't work, your file type may not be supported. Please get in touch (send your file or share with 
us if possible), and we will see if it can be supported - email contact@wp-glogin.com.

To embed Google Drive Folders or image file types, you will require the premium version of the plugin. You will be 
notified if that is the case for your selected file.

= How does the plugin respect Google Drive sharing settings? =

Google Drive Embedder will show different behavior depending on your document's type and its sharing settings within Google Drive.

Generally, we recommend setting files' Sharing settings to at least 'anyone with the link can view', in order for them to be 
visible to all visitors. 

This setting is essential for third-party file types such as Word and PDF (otherwise all visitors will see unintelligible content).

You can use lower sharing settings for Google documents (e.g. share only within the organization, or with specific users), but in 
that case you will need your users to be logged in to a Google account that is authorized to view the content (otherwise, they 
will be told they do not have permission).

When using 'anyone with the link can view', you must understand that any visitors to your WordPress site will be able to obtain 
that document's link and potentially open the document outside of your WordPress site.

= I embed a (non-Google) document, but I just see some HTML in the published post =

Specifically, you see something starting:

&lt;!DOCTYPE html&gt;  
&lt;html...  
&lt;head...  

Most likely, you need to increase sharing settings for the file. In your Google Drive, find the file and click 
'Share'. Click 'Change', and then on 'Anyone with the link can view'. Click 'Done'.

If you reload your published page or post in WordPress, it should now display properly, or at least give a message
saying that the document type is unsupported. Please get in touch if not!

= How is this different to the plugin Google Doc Embedder? =

Google Doc Embedder only allows you to embed other files such as PDF, Word etc in your site. It has nothing much to do 
with Google, other than the fact it uses an online Google service to render documents.
By contrast, our plugin (Google Drive Embedder) allows you to browse your Google Drive files and easily 
embed those directly into your site - both native Google formats and other file types PDF, Word, ZIP etc.

= Why do I also need to install the Google Apps Login plugin? =

This Google Drive plugin extends the Google Apps Login plugin, making use of that plugin's settings rather than 
insisting that you register a new whole new application with Google for each plugin separately. For those of your users 
who choose to Login via Google to connect to your WordPress site, they only need to authenticate once to be able to browse 
their Google Drive through the Google Drive plugin, rather than having to click a second time to allow Drive access.

Because of this, the Google Drive plugin itself requires no configuration at all - it is delegated to Google Apps Login.

For Multisite Network, this means that admins can set up Google Apps Login network-wide, but safely defer the choice of activating 
any further plugins (which extend Google Apps Login) to individual site administrators.

= I have installed Google Apps Login plugin but the Google Drive plugin still says I need to install it =

Are you sure you have upgraded to the latest version - must be 2.0 or higher?

Have you also configured the plugin? Under Settings -> Google Apps Login, you will need to follow the instructions 
to obtain a Client ID and Client Secret from Google Cloud Console, and enter them into that settings page.

= How can I purchase the premium version? =

You can purchase a license here: 
[http://wp-glogin.com/drive/](http://wp-glogin.com/drive/?utm_source=Drive%20ReadmeFAQ&utm_medium=freemium&utm_campaign=Freemium)

= What are the system requirements? =

*  PHP 5.2.x or higher with Curl and JSON extensions
*  Wordpress 3.3 or above

And you will need a Google account to set up the Google Apps Login plugin.

== Installation ==

For the Google Drive plugin to work, you will need also need to install and configure the Google Apps Login plugin 
(either before or after).

Google Drive plugin:

1. Go to your WordPress admin control panel's plugin page
1. Search for 'Google Drive Embedder'
1. Click Install
1. Click Activate on the plugin
1. If you do not have the correct version of Google Apps Login installed, you will see a warning notice to that effect, in
which case you should follow the instructions below

Google Apps Login plugin:

1. Go to your WordPress admin control panel's plugin page
1. Search for 'Google Apps Login'
1. Click Install
1. Click Activate on the plugin
1. Go to 'Google Apps Login' under Settings in your Wordpress admin area
1. Follow the instructions on that page to obtain two codes from Google, and also submit two URLs back to Google
1. **In the Google Cloud Console, you must also enable the switch for Google Drive API access**

If you cannot install from the WordPress plugins directory for any reason, and need to install from ZIP file:

1. For Google Drive plugin: Upload `googledriveembedder` directory and contents to the `/wp-content/plugins/` directory, 
or upload the ZIP file directly in the Plugins section of your Wordpress admin
1. For Google Apps Login plugin: Upload `googleappslogin` directory and contents to the `/wp-content/plugins/` directory, 
or upload the ZIP file directly in the Plugins section of your Wordpress admin
1. Follow the instructions to configure the Google Apps Login plugin post-installation

== Shortcodes ==

Attribute options for [google-drive-embed ...] shortcode

**Important: please note that you cannot normally switch the style attributes around while keeping the url the same.
Most often, Google will require a different URL for the new link type, which can be obtained by opening the Drive Embedder dialog
box again.**

= url (required) =

The url pointing to the Drive file or resource. Note that most Google Drive files will required a different URL 
depending on the style and other factors below.

= style (defaults to 'normal') =

Values: normal | download | embed

= newwindow (defaults to 'no') =

Values: yes | no

Only relevant when style='normal'

= width/height =

Dimensions of the iframe to be ebedded.
Only relevant when style='embed'.
Specified in pixels or as a percentage, e.g. '400' or '100%'.

= plain (defaults to 'no') =

Values: yes | no

When set to 'yes', will NOT display the icon specified in "icon" below.
Only relevant when style='normal' or 'download'.

= icon =

URL to an icon file to display next to the link.
Only relevant when style='normal' or 'download'; and when plain not set to "yes".

= extra =

Values: folder | image | calendar

Used by the premium plugin only for these special file types.

= title =

Text to display within the link to a 'normal' or 'download' file.


= CSS =

You can use custom CSS styles to affect some of the final results.

Example html code for style='download' or 'normal':

&lt;p&gt;&lt;span class="gdm-drivefile-embed"&gt;&lt;img src="$icon" width="16" height="16" /&gt; &lt;a href="$url"&gt;$title&lt;/a&gt;&lt;/span&gt;&lt;/p&gt;

Example html code for style='download' or 'normal', when plain='yes':

&lt;a href="$url"&gt;$title&lt;/a&gt;

Example html code for style='embed':

&lt;iframe width='$width' height='$height' frameborder='0' scrolling='no' src='$url'&gt;&lt;/iframe&gt;


Please get in touch if you would like to make suggestions for further CSS configurability - email contact@wp-glogin.com.


== Changelog ==

= 2.3 =

Provides information about Google forms availability

= 2.2 =

Instructions for video embed

= 2.1 =

Clearer error messages

= 2.0 =

Provides information about premium upgrade to embed certain new filetypes

= 1.4 =

Layout changes ready for WordPress 3.9 release

= 1.3 =

Extra support for non-Google file types such as PDF, Word DOC - can now be embedded inline or direct-download links.

= 1.2 =
Added Search box functionality

= 1.1 =
Multisite installations now have the choice of Network Activate (so Add Drive File available on all sites), or 
individual sub-site activation.

= 1.0 =
Google Drive document embedder
