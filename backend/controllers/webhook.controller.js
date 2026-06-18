import Stripe from "stripe";
import { stripe } from "../utils/stripe.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { fulfillPurchase } from "./coursePurchase.controller.js";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        if (!stripe || !endpointSecret) {
            return response.status(400).send(`Webhook Error: Stripe or Webhook Secret is missing`);
        }
        
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {

        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            const purchase = await CoursePurchase.findOne({ paymentId: session.id });
            
            if (purchase) {
                if (session.payment_status === "paid") {
                    await fulfillPurchase(purchase);

                }
            } else {

            }
        } catch (error) {

            return response.status(500).send(`Webhook fulfillment error`);
        }
    } else {
    }

    response.send();
};
