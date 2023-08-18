// const nodemailer = require('nodemailer');
// const {google} = require('googleapis');
import { google } from 'googleapis';


const CLIENT_ID = '241966183545-i1kij6ck37n9l4so3sra5388tvogb3jf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04JaPGW28PzOuCgYIARAAGAQSNwF-L9IrEOsKjSja91yZLPe5aCmeLLuCZ5ucQ5AGK8tnATkhsbg1YBn1-qrPlYu4sUcvM_-VAUU';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
