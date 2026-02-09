# Portfolio Website

A modern, responsive portfolio website built with Django and Python.

## Features

- **Home**: Welcome page with hero section and feature highlights
- **About Me**: Personal information and statistics
- **Skills**: Technical skills with visual progress bars
- **Projects**: Portfolio of projects with descriptions
- **Experience**: Professional experience timeline
- **Resume**: Resume preview and download section
- **Certificates**: View-only gallery of certificates, trainings, and seminars with modal image viewer
- **Contact**: Contact form and information

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
```bash
venv\Scripts\activate
```
- On macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (optional, for admin access):
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

7. Open your browser and navigate to `http://127.0.0.1:8000/`

## Project Structure

```
portfolio/
├── manage.py
├── portfolio_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── portfolio/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templates/
│       └── portfolio/
│           ├── base.html
│           ├── home.html
│           ├── about.html
│           ├── skills.html
│           ├── projects.html
│           ├── experience.html
│           ├── resume.html
│           ├── certificates.html
│           └── contact.html
├── static/
│   └── portfolio/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── main.js
├── requirements.txt
└── README.md
```

## Customization

1. **Update Personal Information**: Edit the templates in `portfolio/templates/portfolio/` to add your personal information, projects, and experience.

2. **Modify Colors**: Edit the CSS variables in `static/portfolio/css/style.css` to change the color scheme.

3. **Add Images**: 
   - **Profile Picture**: Place your profile picture at `static/portfolio/images/profile-picture.jpg`
   - **Certificate Images**: Place certificate images in `static/portfolio/images/certificates/`
   - See `HOW_TO_ADD_IMAGES.md` for detailed instructions on adding images and PDFs
   - The certificates page includes a modal viewer - click any certificate image to view it in full size
   - If an image is missing, a placeholder will be shown automatically

5. **Contact Form**: The contact form currently shows an alert. To make it functional, you'll need to:
   - Create a model to store contact messages
   - Update the contact view to handle form submissions
   - Configure email settings in `settings.py` if you want to send emails

## Technologies Used

- Python 3.x
- Django 4.2+
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- JavaScript (Vanilla JS)

## License

This project is open source and available under the MIT License.

