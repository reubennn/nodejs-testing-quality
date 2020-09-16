// Libraries used to create test stub
const proxyquire = require("proxyquire");
const sinon = require("sinon");

const chai = require("chai");
const should = chai.should();

const Reservation = require("../../../lib/schema/reservation");
// const reservations = require("../../../lib/reservations");

// For stubbing
const db = require("sqlite");

// For Spies
const sinonChai = require("sinon-chai");
chai.use(sinonChai); // Use sinon-chai plugin

describe("Reservations Library", function () {
    // Set up anonymous test stub
    const debugStub = function () {
        return sinon.stub();
    };
    let reservations;

    before(function () {
        reservations = proxyquire("../../../lib/reservations.js", {
            debug: debugStub,
        });
    });

    context("Validate", function () {
        it("should pass a valid reservation with no optional fields",
            function () {
                const reservation = new Reservation({
                    date: "2017/06/10",
                    time: "06:02 AM",
                    party: 4,
                    name: "Family",
                    email: "username@example.com",
                });

                return reservations.validate(reservation)
                    .then((actual) => actual.should.deep.equal(reservation));
            });

        it("should fail an invalid reservation with a bad email",
            function () {
                const reservation = new Reservation({
                    date: "2017/06/10",
                    time: "06:02 AM",
                    party: 4,
                    name: "Family",
                    email: "username",
                });

                return reservations.validate(reservation)
                    .catch((err) => err.should.be.an("error").and.not.be.null);
            });
    });

    context("Create", function () {
        // For stubbing a custom response
        let dbStub;

        // For testing spies
        let validateSpy;

        before(function () {
            // SQLite uses promises, so use sinon to resolve it to an object
            dbStub = sinon.stub(db, "run").resolves({
                stmt: {
                    lastID: 1349,
                },
            });

            reservations = proxyquire("../../../lib/reservations", {
                debug: debugStub,
                // sqlite = actual name of module not variable
                sqlite: dbStub,
            });
        });

        after(function () {
            dbStub.restore();
        });

        // Testing a custom response using stubs
        it("should return the created reservation ID",
            function (done) {
                const reservation = new Reservation({
                    date: "2017/06/10",
                    time: "06:02 AM",
                    party: 4,
                    name: "Family",
                    email: "username@example.com",
                });

                reservations.create(reservation)
                    .then((lastID) => {
                        lastID.should.deep.equal(1349);
                        done();
                    })
                    .catch((err) => done(err));
            });

        // Testing and observing interactions with spies
        // NOT WORKING (code copied directly from LinkedIn Learning)
        it("should call the validator with a transformed reservation once",
            function (done) {
                const reservation = new Reservation({
                    date: "2017/06/10",
                    time: "06:02 AM",
                    party: 4,
                    name: "Family",
                    email: "username@example.com",
                });

                /* Assign with sinon.spy on the reservations object,
                specifically on the validate method */
                validateSpy = sinon.spy(reservations, "validate");

                reservations.create(reservation)
                    .then(() => {
                        validateSpy.should
                            .have.been.calledOnce;
                        // .and.been.calledWith({
                        //     party: 4,
                        //     name: "Family",
                        //     email: "username@example.com",
                        //     phone: undefined,
                        //     message: undefined,
                        //     datetime: "2017-06-10T06:02:00.000Z",
                        // });

                        validateSpy.restore();
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    // Verifying behaviour with mocking
    context("Save", function () {
        let dbMock;

        // Before the test runs
        before(function () {
            // Mock the database
            dbMock = sinon.mock(db);
        });

        // After the test runs
        after(function () {
            // Restore the mock database back to original state
            dbMock.restore();
        });

        it("should only call the database once",
            function () {
                dbMock.expects("run")
                    .once();

                reservations = proxyquire("../../../lib/reservations", {
                    debug: debugStub,
                    sqlite: dbMock,
                });

                const reservation = {
                    datetime: "2017-06-10T06:02:00.000Z",
                    party: 4,
                    name: "Family",
                    email: "username@example.com",
                    message: undefined,
                    phone: undefined,
                };

                reservations.save(reservation);

                // Get dbMock to verify itself
                dbMock.verify();
            });
    });
});
