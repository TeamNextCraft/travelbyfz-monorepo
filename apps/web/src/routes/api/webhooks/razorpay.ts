// import { createFileRoute } from "@tanstack/react-router";
// import { eq } from "drizzle-orm";
// import { db } from "#/lib/db-config.ts";
// import { webinarRegistrations } from "@repo/db/schema/webinar-registrations.js";
// import { hmacSha256, safeEqual } from "#/lib/utils";
// import { env } from "cloudflare:workers"
// // import { sendWebinarConfirmation } from "#/server/actions/notifications";
// 
// export const Route = createFileRoute("/api/webhooks/razorpay")({
//   server: {
//     handlers: {
//       POST: async ({ request }) => {
//         const rawBody = await request.text();
//         const signature = request.headers.get("x-razorpay-signature") ?? "";
// 
//         const expected = await hmacSha256(env.RAZORPAY_WEBHOOK_SECRET!, rawBody);
// 
//         if (!safeEqual(expected, signature)) return new Response("Bad signature", { status: 400 })
// 
//         const payload = JSON.parse(rawBody);
// 
//         try {
//           if (payload.event === "payment.captured" || payload.event === "order.paid") {
//             const orderId = payload.payload.payment.entity.order_id;
//             const [reg] = await db
//               .update(webinarRegistrations)
//               .set({ status: "paid" })
//               .where(eq(webinarRegistrations.razorpayOrderId, orderId))
//               .returning();
// 
//             if (reg && !reg.zoomLinkSent) {
//               // await sendWebinarConfirmation(reg);
//             }
// 
//           }
//         } catch (error) {
//           return new Response("Internal Server Error", { status: 500 });
//         }
//         return new Response("ok", { status: 200 });
//       }
//     },
//   },
// });

import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { hmacSha256, safeEqual } from "#/lib/utils";
import { markOrderFailed, markOrderPaid } from "#/server/actions/razorpay-webhook";
// import { sendWebinarConfirmation } from "#/server/actions/notifications";
// import { sendTourBookingConfirmation } from "#/server/actions/notifications";

type RazorpayPaymentEntity = {
  id?: string;
  order_id?: string;
  amount?: number;
  status?: string;
  method?: string;
};

type RazorpayWebhookPayload = {
  event: string;
  payload?: {
    payment?: {
      entity?: RazorpayPaymentEntity;
    };
    order?: {
      entity?: {
        id?: string;
        status?: string;
        amount?: number;
      };
    };
  };
};

function getPaymentEntity(payload: RazorpayWebhookPayload) {
  return payload.payload?.payment?.entity;
}

export const Route = createFileRoute("/api/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();

        const signature =
          request.headers.get("x-razorpay-signature") ?? "";

        const eventId =
          request.headers.get("x-razorpay-event-id") ?? null;

        const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;

        if (!webhookSecret) {
          console.error("RAZORPAY_WEBHOOK_SECRET is missing");
          return new Response("Webhook secret is not configured", {
            status: 500,
          });
        }

        const expectedSignature = await hmacSha256(
          webhookSecret,
          rawBody,
        );

        if (!safeEqual(expectedSignature, signature)) {
          console.warn("Invalid Razorpay webhook signature");

          return new Response("Bad signature", {
            status: 400,
          });
        }

        let payload: RazorpayWebhookPayload;

        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", {
            status: 400,
          });
        }

        /*
         * Optional event-id deduplication:
         *
         * If you create a razorpayWebhookEvents table, insert eventId here
         * with a unique constraint and return 200 if it already exists.
         *
         * Do not rely only on this because database confirmation flags
         * should still be idempotent.
         */
        console.info("Razorpay webhook received", {
          event: payload.event,
          eventId,
        });

        try {
          const isPaidEvent =
            payload.event === "payment.captured" ||
            payload.event === "order.paid";

          if (isPaidEvent) {
            const payment = getPaymentEntity(payload);

            const orderId = payment?.order_id;
            const paymentId = payment?.id;

            if (!orderId || !paymentId) {
              console.error("Missing payment order ID or payment ID", {
                event: payload.event,
                eventId,
              });

              return new Response("Invalid payment payload", {
                status: 400,
              });
            }

            const handled = await markOrderPaid({
              orderId,
              paymentId,
              paymentMethod: payment?.method ?? null,
              eventId,
            });

            console.info("Razorpay paid event handled", {
              orderId,
              paymentId,
              handled,
              eventId,
            });
          }

          if (payload.event === "payment.failed") {
            const payment = getPaymentEntity(payload);

            const orderId = payment?.order_id;
            const paymentId = payment?.id;

            if (!orderId) {
              console.error("Missing failed payment order ID", {
                eventId,
              });

              return new Response("Invalid failed payment payload", {
                status: 400,
              });
            }

            await markOrderFailed({
              orderId,
              paymentId: paymentId ?? null,
            });

            console.info("Razorpay failed event handled", {
              orderId,
              paymentId,
              eventId,
            });
          }

          return new Response("ok", {
            status: 200,
          });
        } catch (error) {
          console.error("Razorpay webhook processing failed", {
            error,
            event: payload.event,
            eventId,
          });

          /*
           * Returning 500 tells Razorpay to retry the webhook.
           * This is appropriate when the database or confirmation
           * notification failed.
           */
          return new Response("Internal Server Error", {
            status: 500,
          });
        }
      },
    },
  },
});
