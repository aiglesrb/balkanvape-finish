import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.14.0'

const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY nije konfigurisan u Supabase Edge Functions secrets.')
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const { items, customer_details, success_url, cancel_url, shipping = 0, apply_discount = false } =
      await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Korpa je prazna.')
    }

    // 10% off when 2+ items in cart
    const discountFactor = apply_discount ? 0.9 : 1

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
          description: item.puffs ? `${item.puffs} puffs` : undefined,
        },
        unit_amount: Math.round(item.price * discountFactor * 100),
      },
      quantity: item.qty,
    }))

    const shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount' as const,
          fixed_amount: {
            amount: Math.round(Number(shipping) * 100),
            currency: 'eur',
          },
          display_name: shipping > 0 ? 'Standardna dostava (24-48h)' : 'Besplatna dostava',
          delivery_estimate: {
            minimum: { unit: 'business_day' as const, value: 1 },
            maximum: { unit: 'business_day' as const, value: 2 },
          },
        },
      },
    ]

    const origin = req.headers.get('origin') || ''

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: success_url || `${origin}/?payment=success`,
      cancel_url: cancel_url || `${origin}/checkout?payment=cancelled`,
      shipping_address_collection: {
        allowed_countries: ['RS', 'ME', 'BA', 'HR', 'MK', 'SI'],
      },
      billing_address_collection: 'auto',
      shipping_options,
      phone_number_collection: { enabled: true },
      locale: 'auto',
      metadata: {
        customer_name: `${customer_details?.firstName ?? ''} ${customer_details?.lastName ?? ''}`.trim(),
        customer_address: customer_details?.address ?? '',
        customer_city: customer_details?.city ?? '',
        customer_phone: customer_details?.phone ?? '',
        discount_applied: apply_discount ? '10%' : 'none',
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('create-checkout error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message ?? 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
