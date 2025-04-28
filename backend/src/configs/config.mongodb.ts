import 'dotenv/config';

const dev = { 
    app: {
        port: Number(process.env.DEV_APP_PORT) || 2050,
    },
    db: {
        name: process.env.DEV_DB_NAME || 'eCommerce_dev',    
        host: process.env.DEV_DB_HOST || 'localhost',
        port: Number(process.env.DEV_DB_PORT) || 27017,
    },
}

const prod = { 
    app: {
        port: Number(process.env.PROD_APP_PORT) || 3055,
    },
    db: {
        name: process.env.PROD_DB_NAME || 'eCommerce_prod',    
        host: process.env.PROD_DB_HOST || 'localhost',
        port: Number(process.env.PROD_DB_PORT) || 27017,
    },
}

const config = { dev, prod };
const env = (process.env.NODE_ENV as keyof typeof config) || 'dev';

export default config[env];
