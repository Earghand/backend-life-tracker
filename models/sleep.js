const db = require("../db")
// const { Sleep } = require("../routes")
const { BadRequestError, NotFoundError } = require("../utils/errors")


class Sleep {
    static async listSleeps() {
        console.log("nahahahah")
        const results = await db.query(
           `
            SELECT p.id,
                    p.hours,
                    p.user_id AS "userId",
                    p.created_at AS "createdAt"
            FROM sleeps AS p
                JOIN users AS u ON u.id = p.user_id
            ORDER BY p.created_at DESC
           ` 
        )
        return results.rows;
    }

    static async fetchSleepById(sleepId) {
        console.log("nahahahah")
        console.log("FOUND")
        const results = await db.query(
           `
            SELECT p.id,
                    p.hours,
                    p.user_id AS "userId",
                    p.created_at AS "createdAt"
            FROM sleeps AS p
                JOIN users AS u ON u.id = p.user_id
            WHERE p.id = $1
           `, [sleepId]
        )
        const sleep = results.rows[0];
        console.log(sleep);
        if(!sleep) {
            throw new NotFoundError();
        }
        return sleep;
    }
    static async createNewSleep({ post, user }) {
        //create a new post
        const requiredFields = ["hours"]
        console.log("CRAETING NEW SLEEP")
        requiredFields.forEach(field => {
            if(!post.hasOwnProperty(field)) {
                throw new BadRequestError(`Required field - ${field} - missing from request body.`)
            }
        })
      
        const results = await db.query(
            `
            INSERT INTO sleeps (hours, user_id)
            VALUES ($1,(SELECT id FROM users WHERE email = $2))
            RETURNING id,
                        hours AS "hours",
                        user_id AS "userId",
                        created_at AS "createdAt"
            `, [post.hours, user.email]
        )
        console.log("ROW OF 0")
        return results.rows[0];
    }
}

module.exports = Sleep;