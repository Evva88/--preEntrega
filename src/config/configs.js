import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program 
   .option('-d, --debug', 'Variable for debug', false)
   .option('-p, --port <port>', 'Server port', 8080)
   .option('--mode <mode>', 'Option mode', 'development')
   .option('-t, --test', 'Option for test mode', false);

program.parse();

console.log('Mode Option: ', program.opts().mode);

const environment = program.opts().mode || (program.opts().test ? 'test' : 'development');

dotenv.config({
   path:
      environment === 'production'
         ? './src/config/.env.production'
         : environment === 'test'
            ? './src/config/.env.test'
            : './src/config/.env.development',
});
export const PORT = process.env.PORT
export const MONGODB_CNX_STR = process.env.MONGODB_CNX_STR
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL 
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
export const SECRET_SESSIONS = process.env.SECRET_SESSIONS
export const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB
export const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB
export const JWT_KEY = process.env.JWT_KEY
export const PERCISTENCE = process.env.PERCISTENCE
export const GMAIL_USER = process.env.GMAIL_USER
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD
export const TWILIO_NUMBER = process.env.TWILIO_NUMBER
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN

export default{
       environment: environment
}