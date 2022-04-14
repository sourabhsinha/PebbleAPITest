var express = require('express');
var Validator = require('validator')
const res = require('express/lib/response');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function ()
{
    router.route('/ProvideQuote')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);

                    //assumption that the name is validated, and provided.
                    request.input("name", sql.VarChar(255), req.body.Name)
                    //assumption that the DOB is in correct date format
                    request.input("DOB", sql.Date, req.body.DOB)
                
                    //assumption that the Zipcode is in the correct zipcode format
                    request.input("zipcode", sql.Int, req.body.Zipcode)
                 
                        request.execute("sp_ProvideQuote").then(function (recordSet) {
                            transaction.commit().then(function () {
                                res.status(200).send(recordSet.recordset);
                                conn.close();
                            }).catch(function (err) {
                                conn.close();
                                res.status(400).send("Error while inserting data");
                            });
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            });
                        



        router.route('/QuoteDetails')
        .get(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("quoteid", sql.Int, req.body.QuoteID)
                    request.execute("sp_GetQuoteDetails").then(function (recordSet){   
                            res.status(200).send(recordSet.recordset);
                            conn.close();
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                 }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        });


        router.route('/QuoteDetailsLast24')
        .get(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    if (req.body.Zipcode){
                        request.input("zipcode", sql.Int, req.body.Zipcode)}
                    if (req.body.Floor){
                        request.input("floorTotalPremium", sql.Float, req.body.Floor)}
                    if (req.body.Ceiling){
                        request.input("ceilingTotalPremium", sql.Float, req.body.Ceiling)}                    

                    request.execute("sp_GetQuotes24hour").then(function (recordSet){   
                            res.status(200).send(recordSet.recordset);
                            conn.close();
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                 }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        });


        router.route('/PremiumForThisMonth')
        .get(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.execute("sp_ComputePremiums").then(function (recordSet){   
                            res.status(200).send(recordSet.recordset);
                            conn.close();
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                 }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        });

    return router;
};

module.exports = routes;
