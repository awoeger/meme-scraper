const fetch = require('node-fetch');
const cheerio = require('cheerio');
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

  console.log(firstTenImages);
};

getMemeHTML();
