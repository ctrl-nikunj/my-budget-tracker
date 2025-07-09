import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const google_id = profile.id;
      const name = profile.displayName;
      const email = profile.emails[0].value;

      console.log("Google Profile:", profile);
      console.log("Inserting user:", { name, email, google_id });

      try {
        // Check if user already exists
        const userResult = await pool.query(
          "SELECT * FROM users WHERE google_id = $1",
          [google_id]
        );

        let user = userResult.rows[0];

        if (!user) {
          // Create new user
          const insertResult = await pool.query(
            "INSERT INTO users (google_id,name, email) VALUES ($1, $2, $3) RETURNING *",
            [google_id, name, email]
          );
          user = insertResult.rows[0];
        }

        // Generate JWT
        const tokenPayload = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Attach JWT to user object
        done(null, { token: accessToken, refreshToken });
      } catch (err) {
        done(err, null);
      }
    }
  )
);
