# OpenDownload3      

[![Add to Firefox](https://user-images.githubusercontent.com/8534298/159437285-2021983a-04bb-4760-bacc-2ba7b412f03b.png)](https://addons.mozilla.org/en-US/firefox/addon/opendownload3/)

https://user-images.githubusercontent.com/8534298/159415664-1e02bcb3-70fe-4516-82b9-5c3da81c2d5e.mp4


This extension allows you to automatically download executables to your temporary files folder and run them.

If you are installing a program, this is useful because you will not have to manually delete the file afterwards.

Currently only supports Firefox on Windows.

The project is named in homage to [OpenDownload²](https://addons.thunderbird.net/en-us/firefox/addon/opendownload-10902/) and its predecessor, but is not otherwise related.

---

## Contents

[Setup and install](#setup-and-install)

[How to use](#how-to-use)

[Settings](#settings)

[Building and Developement](#building-and-developement)

---


## Setup and install

1. **Install the extension (if you haven't already).**

2. *(optional, but recommended)* **Create a symlink to your TEMP folder in your default Firefox download folder so that the downloaded files will be deleted automatically by your system.**

    Due to the limitations of WebExtensions, this step is necessary if you want the files to be downloaded to your temporary files folder.

    i. Find your default downloads folder in Settings.
    ![Firefox default download location](https://user-images.githubusercontent.com/8534298/159380375-cd968044-21c5-44b1-8028-55652bf7fe6b.png)

    ii. Download [make_symlink.bat](make_symlink.bat?raw=1), right-click, and click "Run as administrator". If your default download folder is `C:\Users\[USERNAME]\Downloads`, just hit enter. Otherwise if your default download folder is, for example, `C:\Users\[USERNAME]\Desktop\my_downloads`, type "Desktop/my_downloads" (note the forward-slash).

    A folder named "Temp" will be created.

    Alternatively, create a symlink yourself in Command Prompt with `mklink /d [link] [target]`, or in PowerShell with `New-Item -ItemType SymbolicLink -Path [link] -Target [target]`.

---

## How to use

When you click any `.exe` or `.msi` download link, a save dialog will open automatically to your "Temp" folder. You can change the location if you want to save it somewhere else. Save the file, and after the download is completed, a popup will appear.

"Open" runs the file.

"Delete" deletes the file from the disk.

"Don't open" keeps the file on the disk and closes the dialog.

"Show in folder" opens the folder the item was downloaded to.

---

*__Relevant but unrelated to this extension__*

This may affect you if you use the "Open with" feature for other file types.

Downloads are handled differently as of Firefox **version 98**. [See details.](https://support.mozilla.org/en-US/kb/manage-downloads-preferences-using-downloads-menu)

In particular, selecting "Open with" in the save file dialog now downloads the file to your default download location, instead of your temporary files folder as it did previously. If you would like to disable this behavior, go to `about:config` and set `browser.download.improvements_to_download_panel` to `false`.

---

## Settings

You can:

- Change the default save location in the settings. The default folder is `Temp`. This works with nested folders, e.g. `Folder1/Folder2/Folder3`.

- Disable the "Save As" dialog, so that files are automatically downloaded as soon as you click on the link. This setting is independent of your download preferences in the browser settings (pictured in [Setup and install](#setup-and-install), step 1.i)

---

## Building and Developement

`npm run copy-modules`

`npm start` or `npx web-ext run`

To build:

`npm run build` or `npx web-ext build`
