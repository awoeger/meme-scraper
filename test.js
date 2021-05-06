const myURL = new URL(
  'https://api.memegen.link/images/bad/your_meme_is_bad/and_you_should_feel_bad.jpg?width=300',
);

myURL.pathname = `/images/${process.argv[4]}/${process.argv[2]}/${process.argv[3]}`;

console.log(myURL.href);
