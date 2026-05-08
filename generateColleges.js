// Node.js script to generate 25,000 colleges for colleges.json
const fs = require('fs');

const cities = ["Springfield", "Riverside", "Greenfield", "Lakeview", "Hilltop", "Mountainview", "Valley Forge", "Newtown", "Oldtown", "Capitol City", "Franklin", "Madison", "Lincoln", "Jefferson", "Grant", "Harrison", "Roosevelt", "Kennedy", "Carter", "Taylor", "Morgan", "Parker", "Riverdale", "Brookfield", "Lakeside"];
const states = ["CA", "TX", "NY", "FL", "IL", "CO", "PA", "OH", "MI", "WA", "MA", "WI", "NE", "MO", "OR", "KY", "SD", "ND", "ID", "UT", "WV", "MT", "AZ", "CT"];

const colleges = [];
for (let i = 1; i <= 25000; i++) {
  colleges.push({
    id: i,
    name: `Sample College ${i}`,
    city: cities[i % cities.length],
    state: states[i % states.length],
    numStudents: Math.floor(Math.random() * 10000) + 5000,
    tuitionAndFees: Math.floor(Math.random() * 15000) + 10000,
    numMajors: Math.floor(Math.random() * 20) + 25,
    hasSports: i % 2 === 0
  });
}

fs.writeFileSync('src/assets/colleges.json', JSON.stringify({ colleges }, null, 2));
console.log('colleges.json with 25,000 colleges generated!');
