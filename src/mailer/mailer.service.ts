// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailerService {
//   private transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: 'gmail', // You can replace with SMTP provider like Outlook, SES, SendGrid, etc.
//       auth: {
//         user: process.env.EMAIL_USER, // 👈 sender email
//         pass: process.env.EMAIL_PASS, // 👈 app password NOT account password
//       },
//     });
//   }

//   async sendOtpEmail(to: string, otp: string) {
//     try {
//       const mailOptions = {
//         from: `"My App" <${process.env.EMAIL_USER}>`, // sender address
//         to,
//         subject: 'Your OTP Code',
//         text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
//         html: `<h1>OTP Verification</h1>
//                <p>Your OTP code is: <b>${otp}</b></p>
//                <p>This code will expire in 5 minutes.</p>`,
//       };

//       await this.transporter.sendMail(mailOptions);
//       console.log(`✅ OTP email sent to ${to}`);
//       return true;
//     } catch (error) {
//       console.error('❌ Error sending email:', error);
//       throw new InternalServerErrorException('Failed to send OTP email');
//     }
//   }
// }