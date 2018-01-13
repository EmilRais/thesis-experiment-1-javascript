import * as express from "express";
const MongoClient = require('mongodb').MongoClient;

const app = express.App();
users = database.collection('users');
MongoClient.connect("some-mongo-url", function(err, client) {
    const database = client.db("database");
    const users = database.collection('users');
});

app.post("/users", (request, response) => {
    const isValid = !request.body._id
        && typeof request.body.name === "string"
        && typeof request.body.age === "number"
        && typeof request.body.password === "string";

    if (!isValid) return response.status(400).end();

    users.find({ name: request.body.name }).toArray()
        .then(users => { if (users.length > 0) return response.status(500).end() })
        .then(col.insertOne(request.body))
        .then((error, result) => {
            if (error) return response.status(500).end();
            return response.status(201).end();
        })
        .catch(error => response.status(500).end(error.message));
});

app.get("/users", (request, response) => {
    users.find({}, { age: 0, password: 0 }).skip(request.query.offset).limit(request.query.limit)
        .then((error, result) => {
            return response.status(200).send(result)
        })
        .catch(error => response.status(500).end(error.message));
});

app.get("/users/:id", (request, response) => {
    const id = request.params.id;
    const password = request.get("Authorization")
    users.find({ _id: id, password: password })
        .then((error, result) => {
            if (error || result.length === 0) return response.status(400).end();
            return response.status(200).send(result[0])
        })
        .catch(error => response.status(500).end(error.message));
});

app.put("/users/:id", (request, response) => {
    const id = request.params.id;
    const password = request.get("Authorization")
    users.find({ _id: id, password: password })
        .then((error, result) => {
            if (error || result.length === 0) return response.status(400).end();
        })
        .then(() => users.update({ _id: id }, { age: request.body.age, password: request.body.password }))
        .then((error, result) => response.status(200).end())
        .catch(error => response.status(500).end(error.message));
});

app.delete("/users/:id", (request, response) => {
    const id = request.params.id;
    const password = request.get("Authorization")
    users.find({ _id: id, password: password })
        .then((error, result) => {
            if (error || result.length === 0) return response.status(400).end();
        })
        .then(() => users.delete({ _id: id }))
        .then(() => response.status(200).end())
        .catch(error => response.status(500).end(error.message));
});
