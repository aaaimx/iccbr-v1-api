## Configuration with Stripe.

The platform uses the Stripe API for the payment gateway, the system only allows saving user data and purchase details (tickets) only when the payment is successful, so a webhook is implemented to notify when this happen:

1. Once you can access the Stripe account, you must check the local webhook Dashboard > Developers > Webhooks and where it says **Local listeners**