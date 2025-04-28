

import mongoose from 'mongoose';
import { countConnect } from '../helpers/check.connect';

const db = process.env.MONGODB_URI || '';

class Database {
    private static instance: Database;

    constructor() {
        this.connect()
    }

    connect(type: string = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true})
        }

        if (!db) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        mongoose.connect(db)
        .then( _ => console.log('Connect mongodb success!! ', countConnect( )))
        .catch(err => console.log('Error connect!!')
        )
    
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance() 
export default instanceMongodb