# Rakesh Portfolio

A modern personal portfolio website built to showcase projects, skills, and freelance web development services.

## Overview

This portfolio presents a clean landing page with service highlights, featured work, technical skills, and a contact section. It is built with plain HTML, CSS, and JavaScript for fast loading, easy maintenance, and simple deployment.

## Features

- Responsive layout for desktop, tablet, and mobile screens
- Animated hero section with interactive cube movement
- Smooth scrolling navigation
- Scroll reveal animations
- Project showcase cards
- Skills and tools section
- Contact form using email compose behavior

## Tech Stack

- HTML5
- CSS3
- JavaScript

## Project Structure

```text
Portfolio/
  index.html
  style.css
  main.js
  README.md
```

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
```

Open the project folder:

```bash
cd Portfolio
```

Run a local development server:

```bash
python -m http.server 8000
```

Open in your browser:

```text
http://localhost:8000
```

## Deployment

This project can be deployed easily with GitHub Pages, Netlify, Vercel, or any static hosting platform.

## Vercel Security Configuration

This project includes `vercel.json` to apply security headers when deployed on Vercel.

Validate the file before deployment:

```powershell
Get-Content .\vercel.json -Raw | ConvertFrom-Json
```

If the command shows no error, the JSON format is valid.

The `vercel.json` file applies headers to every page using this rule:

```json
"source": "/(.*)"
```


## Author
Rakesh



