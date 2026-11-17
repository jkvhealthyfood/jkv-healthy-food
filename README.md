# JKV Healthy Food Website

Static website for JKV Healthy Food, featuring product information, a shopping basket, and WhatsApp ordering.

## Project structure

```text
.
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── main.js
    │   ├── product-catalog.js
    │   ├── tailwind.config.js
    │   └── products/
    │       ├── fresh-sprouts.js
    │       ├── ready-to-cook-vegetables.js
    │       ├── salad-boxes.js
    │       └── sprouts-idli-batter.js
    └── images/
        ├── JKV_fav_2.png
        ├── salads/
        ├── sprouts/
        └── vegetable/
```

## Run locally

No build step or package installation is required. From the project root, start a local web server:

```powershell
py -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser. Stop the server with `Ctrl+C`.

Alternatively, open `index.html` with the VS Code Live Server extension.

## External services

The page loads Google Fonts, Tailwind CSS, Lucide icons, GSAP, and Google Tag Manager from external CDNs/services. An internet connection is needed for those resources.

## Updating products and assets

- Product information is defined in `assets/js/products/`.
- Basket and page behavior is in `assets/js/main.js` and `assets/js/product-catalog.js`.
- Site styles are in `assets/css/styles.css`.
- Images are in `assets/images/`; the browser favicon is `assets/images/JKV_fav_2.png`.
- Keep asset references relative to the project root, for example `assets/images/sprouts/mixed-sprouts.jpeg`.
