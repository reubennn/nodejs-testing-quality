const chai = require("chai");
const Reservation = require("../../../../lib/schema/reservation");

const should = chai.should();

describe("Reservation Schema", function () {
    /* We need to use function() with mocha and not arrow function as
     * it interferes with this */
    context("Date and Time Combination", function () {
        it("should return an ISO 8601 date and time with valid input",
            function () {
                const date = "2017/06/10";
                const time = "06:02 AM";

                Reservation.combineDateTime(date, time)
                    .should.equal("2017-06-10T06:02:00.000Z");
            });

        it("should return null on a bad date and time",
            function () {
                const date = "!@#$";
                const time = "fail";

                should.not.exist(Reservation.combineDateTime(date, time));
            });
    });

    context("Validator", function () {
        // Testing callbacks
        it("should pass a valid reservation with no optional fields",
            function (done) { // Add callback to it()
                const reservation = new Reservation({
                    date: "2017/06/10",
                    time: "06:02 AM",
                    party: 4,
                    name: "Family",
                    email: "username@example.com",
                });
                reservation.validator(function (err, val) {
                    val.should.deep.equal(reservation);
                    // Execute the callback when complete
                    done(err); // Fails if there is an error
                });
            });

        // Testing promises
        it("should fail a reservation with a bad email",
            function (done) {
                const reservation = new Reservation({
                    date: "2017/06/10",
                    time: "06:02 AM",
                    party: 4,
                    name: "Family",
                    email: "username",
                });

                reservation.validator(function (err) {
                    err.should
                        .be.an("error")
                        .and.not.be.null;
                    done();
                });
            });
    });
});
