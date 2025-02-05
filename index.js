const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();

const client = new MongoClient('mongodb://localhost:27017');

async function main() {
    // Connexion à MongoDB
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("geo");
    const collection = db.collection('equip');
    
    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('view engine', 'pug');
    app.set('views', './views');
    app.use('/public', express.static('public'));
    
    // Route de test
    app.get('/', (req, res) => {
        res.send('New requet', req.query);
        res.send("Ceci est la route");
    });
    
    // Route pour afficher le formulaire de recherche
    app.get('/geo-search', (req, res) => {
        res.render('geo-search');
    });

    // Route pour retourner les résultats sous forme de HTML
    app.get('/geo-search-results', async function(req, res) {
        console.log(req.query);

        var latitude = parseFloat(req.query.latitude);
        var longitude = parseFloat(req.query.longitude);
        var radius = parseFloat(req.query.radius);

        var filter = {};
        if (Math.abs(longitude) > 0.00001 && Math.abs(latitude) > 0.00001) {
            filter.geometry = { "$geoWithin": { "$center": [[longitude, latitude], radius] } };
        }
        console.log("filter", JSON.stringify(filter));
        const query = collection.find(filter).limit(100);
        const docs = await query.toArray();
        console.log("Found " + docs.length + " records!");
        
        res.render('geo-search-results', {
            results: docs
        });
    });

    // Route pour retourner les résultats sous forme de JSON
    app.get('/geo-search-results-json', async function(req, res) {
        console.log(req.query);

        var latitude = parseFloat(req.query.latitude);
        var longitude = parseFloat(req.query.longitude);
        var radius = parseFloat(req.query.radius);

        var filter = {};
        if (Math.abs(longitude) > 0.00001 && Math.abs(latitude) > 0.00001) {
            filter.geometry = { "$geoWithin": { "$center": [[longitude, latitude], radius] } };
        }
        
        const query = collection.find(filter).limit(100);
        const docs = await query.toArray();
        console.log("Found " + docs.length + " records!");
        
        res.setHeader('Content-Type','application/json')
        res.end(JSON.stringify({
            "type": "FeatureCollection",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": docs
        }));
    });

    // Démarre le serveur
    app.listen(3000);
}




// Appel de la fonction principale
main()
    .then(console.log)
    .catch(console.error);

