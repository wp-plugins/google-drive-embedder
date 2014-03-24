=== Plugin Name ===
Contributors: danlester
Tags: drive, google, document, google apps, google drive, sso, single-sign-on, auth, intranet, embed
Requires at least: 3.3
Tested up to: 3.9
Stable tag: 1.4
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Browse for Google Drive documents and embed directly in your posts/pages. Extends Google Apps Login plugin so no extra user auth required.

== Description ==

Google Drive Embedder gives authors easy access to their Google Drive in a popup box, where they can select documents to embed directly into their post or page. Just as easily as picking a photo from the WordPress media gallery.

Documents can be embedded in-line, using Google's read-only interactive viewer for your audience to read them. Documents can also be placed in your site as links to open up editable files (either in the same or a new browser tab).

You will need to set document sharing settings to ensure your website viewers have access to view your documents (e.g. at least 'anyone with the link can view' to be visible to all visitors).

**This plugin requires that you also install the free (or premium) version of the popular [Google Apps Login](http://wp-glogin.com/wpgoogleappslogin) plugin**

Now with search functionality to find the Drive files you want!

Now displays many file types such as PDF, Word DOC, ZIP etc plus native Google docs (Spreadsheet, Drawing, etc).

Choose from:
 
*  Viewer file link - full page Google viewer and editor
*  Download file link - directly download file to your computer (disabled for native Google doc formats)
*  Embed document - display most file types inline in your posts or pages (non-Google file types need sharing settings at least 'anyone with the link can view')

Useful for public websites or private intranets (as long as you choose the correct sharing settings for your docs within Google Drive). 
Works on all WordPress installations including multisite networks.

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

= Why is the option for Viewer / Download / Embed disabled for some files? =

Download isn't normally enabled for native Google file types.

Embed should be enabled for many non-native file types (e.g. PDF, Word DOC). If not, you may need to increase sharing 
settings within Google Drive to 'anyone with the link may view', or higher.

If that still doesn't work, your file type may not be supported. Please get in touch (send your file or share with 
us if possible), and we will see if it can be supported - email contact@wp-glogin.com.

= What happened to the old 'Normal file link' and 'Plain file link' options from previous plugin versions? =

These two options are now available within the new 'Viewer file link' option. By default, this will give you the old 'Normal' 
style. You should also see a checkbox for 'Plain style' which will give you the old Plain file link display format.

'Download file link' is an option entirely new for version 1.3.

The 'Embed document' option is still the same, but now supports extra formats for which embed was disabled in older versions of the 
plugin.

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

= How can I obtain support for this product? =

Please email [support@wp-glogin.com](mailto:support@wp-glogin.com) with any questions,
and we will try to help. Specify 'Google Drive Embed' in the subject. 

We may occasionally be able to respond to support queries posted on the 'Support' forum here on the wordpress.org
plugin page, but we recommend sending us an email instead if possible.

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

If not, free users should be able to update with one click from their plugins panel. Premium users should 
get in touch with us for upgrade steps from their most recent version.

Have you also configured the plugin? Under Settings -> Google Apps Login, you will need to follow the instructions 
to obtain a Client ID and Client Secret from Google Cloud Console, and enter them into that settings page.

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

== Changelog ==

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
