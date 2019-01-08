const mongoose = require("mongoose");
const Customer = mongoose.model("customer");
const passportJwt = require('passport-jwt');
const bizConfig = require("../../configuration/business");
const passport = require("passport");

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: bizConfig.passport.secretOrKey
}

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log("jwt_payload" + JSON.stringify(jwt_payload));

        Customer
            .findById({_id: jwt_payload.id})
            .then(customer => {
                if (customer) {
                    return done(null, customer);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => console.log(err));
    }));
};

module.exports.JwtAuth = () => passport.authenticate("jwt", {session: false});