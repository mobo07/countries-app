import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const countries = [];

app.get("/", (req, res) => {
    fetch("https://restcountries.com/v3.1/all")
    .then(response => response.json())
    .then(data => {
        if(countries.length === 0) {
            data.forEach(country => {
                countries.push({
                    flag: country.flags.png,
                    name: country.name.common,
                    population: country.population.toLocaleString(),
                    region: country.region,
                    capital: country.capital,
                    subRegion: country.subregion,
                    continent: country.continents,
                    topLevelDomain: country.tld,
                    currencies: country.currencies,
                    languages: country.languages,
                    countryAcronym: country.cca3
                });
            });
        }
    })
    .then(() => {
        res.render("countries", {countryDetails: countries});
    })
    .catch(error => console.log(error));
});

let countryObj = {};
app.get("/country", (req, res) => {
    const countryName = req.query.name;
    fetch("https://restcountries.com/v3.1/name/" + countryName)
    .then(response => response.json())
    .then(data => {
        countryObj = {
            flag: data[0].flags.png,
            name: data[0].name.common,
            population: data[0].population.toLocaleString(),
            region: data[0].region,
            capital: data[0].capital,
            subRegion: data[0].subregion,
            continent: data[0].continents,
            topLevelDomain: data[0].tld,
            currencies: data[0].currencies,
            languages: data[0].languages,
            borders: function() {
                if(data[0].borders === undefined) 
                return undefined;
                else return getCountryAcronymName(...data[0].borders);
            }
        };
    })
    .then(() => {
        res.render("country", {countryInfo: countryObj});
    })
    .catch(error => console.log(error));
        function getCountryAcronymName(...args) {
                let arr = [];
                    args.forEach(arg => {
                        countries.filter(country => {
                             if(arg === country.countryAcronym) {
                                 arr.push(country.name);
                             }    
                        });
                    });
                    return arr;
        }
});

app.get("/error", (req, res) => {
    res.render("error");
});

app.listen(process.env.PORT || 5000, () => {
    console.log("server is running on port 5000");
});
