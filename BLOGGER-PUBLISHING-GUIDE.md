# Publishing the Mowla Digital Portfolio on Blogger — Step by Step

This guide assumes you're using **blogger-single-file.html** (the one-paste
version). If you prefer the separate `index.html` / `style.css` / `script.js`
files instead, see the note at the end of Step 2.

---

## Step 1 — Create a new Page in Blogger

1. Go to [blogger.com](https://www.blogger.com) and open your blog.
2. In the left sidebar, click **Pages**.
3. Click **New page**.
4. Give it a title, e.g. "Home" or "Portfolio".

---

## Step 2 — Paste the HTML

1. In the page editor, click the **⋮** (three dots) menu in the top-right toolbar.
2. Select **HTML view** (this switches the editor from "Compose" mode to raw HTML mode).
3. Delete anything already in the box.
4. Open `blogger-single-file.html` in a text editor, select all, copy, and paste
   the entire contents into the Blogger HTML box.
5. Switch back to **Compose view** briefly to confirm it renders — then switch
   back to HTML view before continuing to the next steps.

> **Using the separate files instead?** Blogger pages don't support linking to
> external `.css`/`.js` files you upload yourself. If you want to keep them
> separate for editing, host `style.css` and `script.js` on GitHub Pages,
> jsDelivr (via a GitHub repo), or your own server, then replace the
> `<link rel="stylesheet" href="style.css">` and
> `<script src="script.js"></script>` lines in `index.html` with the full
> public URLs before pasting into Blogger.

---

## Step 3 — CSS and JavaScript are already in place

Because you pasted the **single-file** version, the `<style>` and `<script>`
blocks are already embedded in the page — there's nothing extra to add here.

---

## Step 4 — Google Fonts

The Poppins font is already linked via `<link href="https://fonts.googleapis.com/...">`
in the `<head>` of the pasted code. No action needed unless Blogger strips
`<head>`-level tags from Page HTML (some themes do) — if the font doesn't load
after publishing, add the same `<link>` tags to your **Theme → Edit HTML**,
just before `</head>`.

---

## Step 5 — Upload your images

1. In Blogger, open any post/page in Compose view, click the **image icon**,
   and upload each image (hero photo, about photo, portfolio shots, logos).
2. After uploading, click the uploaded image and choose **"View image"** or
   right-click → **Copy image address** to get its public URL.
3. Repeat for every image:
   - `hero-image.jpg` (650×750)
   - `about-image.jpg` (550×650)
   - `portfolio-1.jpg` through `portfolio-6.jpg` (370×250 each)
   - `google-logo.png`, `meta-logo.png`, `hubspot-logo.png`,
     `skillshop-logo.png`, `coursera-logo.png` (150×90 each)
   - `favicon.png` (64×64)

---

## Step 6 — Replace the image paths

Back in **HTML view** for your page, use your browser's find-and-replace (or
your text editor before pasting) to swap each placeholder filename for the
real uploaded URL, e.g.:

```
src="hero-image.jpg"   →   src="https://blogger.googleusercontent.com/img/....jpg"
```

Do this for every `src="...jpg"` / `src="...png"` in the file.

---

## Step 7 — Update the Resume button link

Find every occurrence of:

```
YOUR_RESUME_LINK_HERE
```

There are three (navbar button, hero button, CTA section button). Replace all
three with a shareable link to your resume — a Google Drive "Anyone with the
link can view" share link, or a direct PDF URL, works well.

---

## Step 8 — Connect the Google Apps Script Web App URL

1. Open the companion file **AppsScript-Backend.gs** in a new
   [Google Apps Script](https://script.google.com) project.
2. At the top of that file, set `SPREADSHEET_ID` to your sheet's ID (the long
   string in its URL between `/d/` and `/edit`), or leave it blank if the
   script is bound directly to the spreadsheet.
3. Click **Deploy → New deployment**, choose type **Web app**, set
   **Execute as: Me** and **Who has access: Anyone**, then click **Deploy**.
4. Copy the Web App URL Google gives you.
5. Back in your Blogger page's HTML, find this line near the top of the
   `<script>` block:

   ```js
   const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
   ```

   Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with the URL you copied.
6. Submissions will now be appended as new rows in a sheet tab named
   **Bangladesh** inside your spreadsheet, with columns for Date, Time, Full
   Name, Email, Phone, Company, Subject, Message, Browser, Device, IP and
   Status.

---

## Step 9 — Publish

1. Click **Publish** (top-right of the page editor).
2. Open the published page and test it on desktop and mobile:
   - Resize your browser window (or use Chrome DevTools' device toolbar) to
     check 1920px, 1440px, 1024px, 768px, 430px, 390px and 360px widths.
   - Submit a test enquiry through the contact form and confirm a new row
     appears in the **Bangladesh** sheet tab.
   - Confirm the "Thank You!" popup fades and scales in, then auto-closes
     after 4 seconds.

That's it — the site is live, fully responsive, and every enquiry is captured
straight into your spreadsheet.
