import { Client as WorkflowClient } from "@upstash/workflow";
import emailjs from '@emailjs/browser';
// import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

// const qstashClient = new QStashClient({
//   token: config.env.upstash.qstashToken,
// });

// export const sendEmail = async ({
//   email,
//   subject,
//   message,
// }: {
//   email: string;
//   subject: string;
//   message: string;
// }) => {
//   await qstashClient.publishJSON({
//     api: {
//       name: "email",
//       provider: resend({ token: config.env.resendToken }),
//     },
//     body: {
//       from: "JS Mastery <contact@adrianjsmastery.com>",
//       to: [email],
//       subject,
//       html: message,
//     },
//   });
// };



export const sendEmail  =async ({ email, subject, message, }: { email: string; subject: string; message: string; })  => { 
    try{
      const response = await emailjs.send(config.env.emailJs.serviceId, config.env.emailJs.templateId,  {
        user_email: email,
        subject: subject,
        message: message,
      }, {
        publicKey: config.env.emailJs.publicKey,
      })
      console.log("Email sent successfully:", response);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };
