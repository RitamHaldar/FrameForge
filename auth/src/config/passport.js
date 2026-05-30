import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { config } from "./config.js";

export const googleAuth = () => {
    passport.use(new GoogleStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    }));
}

