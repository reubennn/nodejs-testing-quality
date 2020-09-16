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
});
