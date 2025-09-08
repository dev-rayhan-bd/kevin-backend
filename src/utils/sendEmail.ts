/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import httpStatus from 'http-status';
import config from '../app/config';
import AppError from '../errors/AppError';

// Define a type for the mail options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

// Define the sendMail function
const sendEmail = async ({
  from,
  to,
  subject,
  text,
}: MailOptions): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.smtp_user,
        pass: config.smtp_pass,
      },
    });

    const mailOptions: SendMailOptions = {
      from,
      to,
      subject,
      text,
    };

    // Wait for the sendMail operation to complete
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No items in the order.');
    console.error('Error sending mail: ', error);
    // return false;
  }
};

export default sendEmail;
