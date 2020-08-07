var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  return 'CREATE TABLE Country (name TEXT NOT NULL, code TEXT NOT NULL, gdp INTEGER, population INTEGER);';
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  return 'CREATE TABLE GoldMedal (id INTEGER NOT NULL PRIMARY KEY, year INTEGER NOT NULL, city TEXT NOT NULL, season TEXT NOT NULL, name TEXT NOT NULL, country TEXT NOT NULL, gender TEXT NOT NULL, sport TEXT NOT NULL, discipline TEXT NOT NULL, event TEXT NOT NULL);';
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = country => {
  return `SELECT COUNT(*) AS "count" FROM GoldMedal WHERE country = "${country}";`;
};

/*
Returns a SQL query string that will find the year where the given country
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = country => {
  return `SELECT year, COUNT(*) AS "count" FROM GoldMedal WHERE country = "${country}" AND season = "Summer" GROUP BY year ORDER BY COUNT(*) DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the year where the given country
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
  return `SELECT year, COUNT(*) AS "count" FROM GoldMedal WHERE country = "${country}" AND season = "Winter" GROUP BY year ORDER BY COUNT(*) DESC LIMIT 1;`;
};

const bestCategory = (country, category) => {
  return `SELECT ${category}, COUNT(*) AS "count" FROM GoldMedal WHERE country = "${country}" GROUP BY ${category} ORDER BY COUNT(*) DESC LIMIT 1;`
};

/*
Returns a SQL query string that will find the year where the given country
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestYear = country => {
  return bestCategory(country, 'year');
};

/*
Returns a SQL query string that will find the discipline this country has
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
  return bestCategory(country, 'discipline');
};

/*
Returns a SQL query string that will find the sport this country has
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
  return bestCategory(country, 'sport');
};

/*
Returns a SQL query string that will find the event this country has
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  return bestCategory(country, 'event');
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const numberMenMedalists = country => {
  return `WITH menwithgolds AS (SELECT COUNT(*) FROM goldmedal WHERE country = "${country}" AND gender = "Men" GROUP BY name) SELECT COUNT(*) AS "count" FROM menwithgolds;`;
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  return `WITH womenwithgolds AS (SELECT COUNT(*) FROM goldmedal WHERE country = "${country}" AND gender = "Women" GROUP BY name) SELECT COUNT(*) AS "count" FROM womenwithgolds;`;
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
  return `SELECT name, COUNT(*) AS "count" FROM goldmedal WHERE country = "${country}" GROUP BY name ORDER BY COUNT(*) DESC LIMIT 1;`;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
  let orderByString = '';
  if (field) {
    if (sortAscending) {
      orderByString = `ORDER BY ${field} ASC`;
    } else {
      orderByString = `ORDER BY ${field} DESC`;
    }
  }
  return `SELECT * FROM goldmedal WHERE country = "${country}" ${orderByString};`;
};

/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  let orderByString = '';
  if (field) {
    if (sortAscending) {
      orderByString = `ORDER BY ${field} ASC`;
    } else {
      orderByString = `ORDER BY ${field} DESC`;
    }
  }
  return `WITH totalmedals AS (SELECT COUNT(*) AS "total" FROM goldmedal WHERE country = "${country}"), medalsbysport AS (SELECT sport, COUNT(*) AS "count" FROM goldmedal WHERE country = "${country}" GROUP BY sport ${orderByString}) SELECT medalsbysport.sport, medalsbysport.count, CAST(ROUND(CAST(medalsbysport.count AS REAL) / CAST(totalmedals.total AS REAL) * 100) AS INTEGER) AS "percent" FROM medalsbysport CROSS JOIN totalmedals;`;
};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
