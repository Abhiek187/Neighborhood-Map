# Neighborhood Map

## About

This website shows you a map of a neighborhood close by, allowing users to mark areas of interest, search for locations, and read reviews.

## Dependencies

This site was built using React and loads Google Maps using [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api). Yelp images & reviews are provided through [Yelp Fusion](https://www.yelp.com/fusion). It is mobile friendly, accessible, and can work offline through a Service Worker.

## Running the Program

Click on [this site](https://abhiek187.github.io/Neighborhood-Map) to run the website on Github Pages.

-OR-

To run a local copy:

1. [Clone this repository](https://github.com/Abhiek187/Neighborhood-Map.git)
2. `cd` into this directory
3. Run `npm install`

**For a production build**

- Run the following:

```bash
npm run build
serve -s build
```

- Then open `http://localhost:3000` in your browser.

**For a development build (does not work offline)**

- Run `npm start` and the page should load automatically. (Else, open `http://localhost:3000` in your browser.)
