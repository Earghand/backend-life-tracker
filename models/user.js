const bcrypt = require("bcrypt")
const {  BadRequestError, UnauthorizedError } = require("../utils/errors")
const db = require("../db")
const { BCRYPT_WORK_FACTOR } = require("../config")
const { BadRequest } = require("http-errors")

class User {

    static async makePublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            createdAt: user.created_at
        }
    }

    static async login(credentials) {
        //user should submit their email and password
        //if any of these fields are missing, throw an error
        const requiredFields = ["email", "password"]
        requiredFields.forEach(field=> {
            if(!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })
        //lookup the user in the db by the email
        const user = await User.fetchUserByEmail(credentials.email);
        //if a user is found, compare the submitted password
        //with the password in the db
        //if there is a match, return the user
        if(user) {
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if(isValid) {
                return User.makePublicUser(user);
            }
        }
        //if any of this goes wrong, throw an error.
        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials) {
        const requiredFields = ["email", "password"]
        requiredFields.forEach(field=> {
            if(!credentials.hasOwnProperty(field)) {
                throw new BadRequestError(`Missing ${field} in request body.`)
            }
        })

        if(credentials.email.indexOf("@") <= 0) {
            throw new BadRequestError("Invalid email.")
        }
        //user should submit their email, pw, rsvp status, and # of guests
        //if any of these fields are missing, throw an error.
        
        const existingUser = await User.fetchUserByEmail(credentials.email);

        if(existingUser) {
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }

        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR);

        const lowercasedEmail = credentials.email.toLowerCase();

        //make sure no user already exists in the system with that email
        //if one does, throw an error.
        

        //take the users password, and hash it 
        //take the users email, and lowercase it

        //create a new user in the db with all of their info
        const result = await db.query(`
        INSERT INTO users (
            email,
            password
        )
        VALUES ($1, $2)
        RETURNING id, email, created_at;
        `,
        [lowercasedEmail, hashedPassword]
        )

        //return the user
        const user = result.rows[0]

        return User.makePublicUser(user);
    } 

    static async fetchUserByEmail(email) {
        if(!email) {
            throw new BadRequest("No email provided")
        }

        const query = `SELECT * FROM users WHERE email = $1`

        const result = await db.query(query, [email.toLowerCase()])

        const user = result.rows[0]

        return user;
    }
}

module.exports = User