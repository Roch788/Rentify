const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Beautiful beach stay with amazing views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b"
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    },
    price: 1200,
    location: "New York",
    country: "United States",
  },
  {
    title: "Mountain Retreat",
    description: "Peaceful cabin in mountains.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Camping Experience",
    description: "Live close to nature.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
    },
    price: 800,
    location: "Forest",
    country: "Canada",
  },
  {
    title: "Historic Castle Stay",
    description: "Live like royalty.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98"
    },
    price: 4000,
    location: "Scotland",
    country: "UK",
  }
];


// 🔥 DEMO USER ID (replace with your actual user id)
const demoUserId = "PUT_YOUR_USER_ID_HERE";


// 🔥 CATEGORY FUNCTION
function getCategory(obj) {
  const title = obj.title.toLowerCase();

  if (title.includes("beach")) return ["trending", "pools"];
  if (title.includes("mountain")) return ["mountains"];
  if (title.includes("loft") || title.includes("city")) return ["iconic_city"];
  if (title.includes("camp")) return ["camping"];
  if (title.includes("castle")) return ["castles"];

  return ["trending"];
}


// 🔥 FINAL DATA WITH OWNER + CATEGORIES
const data = sampleListings.map((obj) => ({
  ...obj,
  owner: demoUserId,
  categories: getCategory(obj),
}));


module.exports = { data };