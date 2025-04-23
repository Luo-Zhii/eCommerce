

import mongoose from 'mongoose';
import { countConnect } from '../helpers/check.connect';

const db = 'mongodb+srv://anhduc20053110:Hbja337Ai4nan3NY@clusterjob.sryed.mongodb.net/ecommerce'

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