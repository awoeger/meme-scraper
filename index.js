const fetch = require('node-fetch');
const cheerio = require('cheerio');

// eslint-disable-next-line unicorn/prefer-node-protocol
const fs = require('fs');

const getMemeHTML = async () => {
  // get html text
  const response = await fetch(
    'https://memegen-link-examples-upleveled.netlify.app/',
  );
  // using await to ensure that the promise resolves
  const body = await response.text();

  // parse the html text and extract titles
  const document = cheerio.load(body);

  const firstTenImages = [];
  // Looping through the DOM elements created by cheerio.load(body) and pushing the first 10 images into empty array
  document('img').each((i, img) => {
    if (i <= 9) {
      firstTenImages.push(img.attribs.src);
    }
  });

  // Looping through the array of 10 image links, fetching their data and creating their individual files
  for (let i = 0; i < firstTenImages.length; i++) {
    async function download() {
      const imageResponse = await fetch(firstTenImages[i]);
      const buffer = await imageResponse.buffer();
      fs.writeFile(`./memes/${i}.jpg`, buffer, () =>
        console.log(`finished downloading!`),
      );
    }
    download();
  }

  // Creating an array with all image URL's to implement the user input functionality
  const allImages = [];
  document('img').each((i, img) => {
    if (i) {
      allImages.push(img.attribs.src);
    }
  });

  // Looping through allImages to see if user input matches any of the URL strings and then logging the new URL
  for (let j = 0; j < allImages.length; j++) {
    if (allImages[j].includes(process.argv[4])) {
      // Creating new URL for the images
      const individualURL = new URL(allImages[j]);
      individualURL.pathname = `/images/${process.argv[4]}/${process.argv[2]}/${process.argv[3]}`;

      // Fetching the data of the specific image and downloading it into the new_memes folder
      async function download() {
        const imageResponse = await fetch(individualURL.href);
        const buffer = await imageResponse.buffer();
        fs.writeFile(`./new_memes/${j}.jpg`, buffer, () =>
          console.log(`finished downloading!`),
        );
      }
      download();
    }
  }
};

getMemeHTML();
