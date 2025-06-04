import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
      const email = profile.emails[0].value;

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
            "INSERT INTO users (google_id, email) VALUES ($1, $2) RETURNING *",
            [google_id, email]
          );
          user = insertResult.rows[0];
        }

        // Generate JWT
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        // Attach JWT to user object
        done(null, { token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);
