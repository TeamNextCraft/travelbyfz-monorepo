// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendWebinarConfirmation(registration: {
//   name: string;
//   email: string;
//   phone: string;
// }) {
//   await resend.emails.send({
//     from: "Travel Entrepreneur Webinar <no-reply@yourdomain.com>",
//     to: registration.email,
//     subject: "You're Registered! Webinar Details Inside",
//     html: `
//       <h2>Hi ${registration.name}, your seat is confirmed 🎉</h2>
//       <p><b>Date:</b> 16 August 2026 (Sunday)</p>
//       <p><b>Time:</b> 11:00 AM – 1:00 PM</p>
//       <p><b>Platform:</b> Zoom Live Session</p>
//       <p>The Zoom link will be shared 1 day before the webinar on this email and WhatsApp.</p>
//     `,
//   });

//   await fetch(`https://graph.facebook.com/v20.0/${process.env.WA_PHONE_ID}/messages`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       messaging_product: "whatsapp",
//       to: registration.phone,
//       type: "template",
//       template: {
//         name: "webinar_registration_confirmed",
//         language: { code: "en" },
//         components: [
//           { type: "body", parameters: [{ type: "text", text: registration.name }] },
//         ],
//       },
//     }),
//   });
// }
