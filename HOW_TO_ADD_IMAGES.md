# How to Add Images and PDFs to Your Portfolio

## 📸 Adding Your Profile Picture

### Step 1: Prepare Your Image
- Format: JPG, PNG, or WebP
- Recommended size: 400x400px to 600x600px (square)
- File size: Keep under 500KB for faster loading
- Name your file: `profile-picture.jpg` (or `.png`)

### Step 2: Add the Image
1. Place your profile picture in: `static/portfolio/images/`
2. Name it: `profile-picture.jpg` (or your preferred name)

### Step 3: The Template is Already Set Up!
The About Me page will automatically use your profile picture if it's named `profile-picture.jpg` and placed in the correct folder.

**Location:** `static/portfolio/images/profile-picture.jpg`

---

## 🏆 Adding Certificate Images

### Step 1: Prepare Your Certificate Images
- Format: JPG, PNG, or WebP
- Recommended size: 800x600px or larger (maintain aspect ratio)
- File size: Keep under 2MB per image
- Name them according to the list below

### Step 2: Add Certificate Images
1. Place all certificate images in: `static/portfolio/images/certificates/`
2. Use these exact filenames:

```
computer-hardware-basics-cert.jpg
intro-cybersecurity-cert.jpg
java-fundamentals-cert.jpg
ai-business-cert.jpg
data-science-analytics-cert.jpg
cybersecurity-awareness-cert.jpg
effective-leadership-cert.jpg
data-storytelling-cert.jpg
embedded-systems-cert.jpg
appsheet-cert.jpg
future-ready-cert.jpg
digital-footprint-cert.jpg
data-privacy-cert.jpg
digital-citizenship-cert.jpg
oplan-paskong-sigurado-cert.jpg
disaster-preparedness-cert.jpg
```

### Step 3: View Your Certificates
- The certificates will automatically display once you add the images
- Click any certificate image to view it in full size (modal viewer)
- If an image is missing, a placeholder will be shown

---

## 📄 Adding PDF Certificates (Alternative Method)

If you have certificates as PDFs instead of images, you have two options:

### Option 1: Convert PDF to Image
1. Open your PDF certificate
2. Take a screenshot or export as image (JPG/PNG)
3. Save it with the appropriate filename in `static/portfolio/images/certificates/`

### Option 2: Link to PDF Files
If you want to link directly to PDF files, you can:
1. Place PDF files in: `static/portfolio/images/certificates/`
2. Name them: `certificate-name.pdf`
3. Update the template to link to PDFs (requires code modification)

---

## 📁 Folder Structure

Your images should be organized like this:

```
static/
└── portfolio/
    └── images/
        ├── profile-picture.jpg          ← Your profile photo
        └── certificates/
            ├── computer-hardware-basics-cert.jpg
            ├── intro-cybersecurity-cert.jpg
            ├── java-fundamentals-cert.jpg
            ├── ai-business-cert.jpg
            ├── data-science-analytics-cert.jpg
            ├── cybersecurity-awareness-cert.jpg
            ├── effective-leadership-cert.jpg
            ├── data-storytelling-cert.jpg
            ├── embedded-systems-cert.jpg
            ├── appsheet-cert.jpg
            ├── future-ready-cert.jpg
            ├── digital-footprint-cert.jpg
            ├── data-privacy-cert.jpg
            ├── digital-citizenship-cert.jpg
            ├── oplan-paskong-sigurado-cert.jpg
            └── disaster-preparedness-cert.jpg
```

---

## ✅ Quick Checklist

- [ ] Profile picture added to `static/portfolio/images/profile-picture.jpg`
- [ ] Certificate images added to `static/portfolio/images/certificates/`
- [ ] All images are properly named
- [ ] Images are optimized (reasonable file size)
- [ ] Test the website to see if images display correctly

---

## 🖼️ Image Optimization Tips

1. **Use JPG for photos** (smaller file size)
2. **Use PNG for graphics** (better quality for text/logos)
3. **Compress images** before uploading:
   - Online tools: TinyPNG, Squoosh, or ImageOptim
   - Photoshop: Save for Web
   - Windows: Use Paint 3D to resize
4. **Recommended dimensions:**
   - Profile picture: 400x400px to 600x600px
   - Certificates: 800x600px to 1200x900px

---

## 🔧 Troubleshooting

**Images not showing?**
1. Check file names match exactly (case-sensitive)
2. Verify files are in the correct folder
3. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
4. Restart Django server after adding images

**Images too large/slow loading?**
- Compress images using online tools
- Reduce image dimensions
- Use WebP format for better compression

---

## 📝 Notes

- The portfolio uses Django's static files system
- After adding images, you may need to restart the Django server
- In production, you'll need to run `python manage.py collectstatic`

