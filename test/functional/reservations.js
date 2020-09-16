// Test Doubles and Express app

const chai = require("chai");
const chaiHttp = require("chai-http");
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const morgan = require("morgan");

chai.use(chaiHttp);
const should = chai.should();

describe("/reservations", function () {
    let dbStub;
    let loggerStub;
    let debugStub;
    let app; // We will proxyquire app

    before(function () {
        dbStub = {
            // One Method (run):
            run: function () {
                return Promise.resolve({
                    stmt: {
                        lastID: 1349,
                    },
                });
            },
        };
        dbStub["@global"] = true; // Since it is not available in app.js

        loggerStub = sinon
            // Create a stub, that has a method named morgan
            .stub(morgan, "morgan")
            // Returns a middleware function:
            .return(function (req, res, next) {
                next(); // Just calls next() to do nothing
            });

        debugStub = function () {
            return sinon.stub();
        };
        debugStub["@global"] = true;

        app = proxyquire("../../app", {
            sqlite: dbStub,
            morgan: loggerStub,
            debug: debugStub,
        });
    });

    after(function () {
        loggerStub.restore();
    });

    context("GET", function () {
        it("should return the reservations form",
            function (done) {
                chai.request(app)
                    .get("/reservations")
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.text.should.contain(
                            "To make reservations please " +
                            "fill out the following form",
                        );
                        done(err);
                    });
            });
    });

    context("POST", function () {
        it("should accept a valid reservation request",
            function (done) {
                chai.request(app)
                    .post("reservations")
                    .set("content-type", "application/x-www-form-urlencoded")
                    .send({
                        date: "2017/06/10",
                        time: "06:02 AM",
                        party: 4,
                        name: "Family",
                        email: "username@example.com",
                    })
                    .end(function (err, res) {
                        res.text.should.contain(
                            "Thanks, your booking request #1349",
                        );
                        res.should.have.status(200);
                        done(err);
                    });
            });

        it("should reject an invalid reservation request",
            function (done) {
                chai.request(app)
                    .post("reservations")
                    .set("content-type", "application/x-www-form-urlencoded")
                    .send({
                        date: "2017/06/10",
                        time: "06:02 AM",
                        party: "bananas",
                        name: "Family",
                        email: "username@example.com",
                    })
                    .end(function (err, res) {
                        res.text.should.contain(
                            "Sorry, there was a problem " +
                            "with your booking request.",
                        );
                        res.should.have.status(200);
                        done();
                    });
            });
    });
});
