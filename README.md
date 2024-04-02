## Configuración con Stripe.

La plataforma utiliza el API de Stripe para la pasarela de pagos, el sistema solo permite guardar los datos del usuario y de los detalles de la compra (tickets) solo cuando el pago es exitoso, por lo que se implementa un webhook para notificar cuando esto ocurra:

1. Una vez se tenga acceso a la cuenta de Stripe considerar el

```
checkout.session.completed
```

Consultar la estructura de la base de datos para un mejor entendimiento:
