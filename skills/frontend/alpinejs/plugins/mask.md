# Mask Plugin

Use Mask to format user input as it is typed. Good fits include phone numbers, dates, card-like grouped input, and fixed-format identifiers. Do not treat masks as validation; backend validation remains authoritative.

## Static Mask

```html
<input
  type="text"
  inputmode="numeric"
  x-model="phone"
  x-mask="+45 99 99 99 99"
  autocomplete="tel"
>
```

## Dynamic Mask

Move branching into the registered component rather than writing it inline.

```html
<input type="text" x-model="cardNumber" x-mask:dynamic="cardMask($input)">
```

```js
document.addEventListener('alpine:init', () => {
  Alpine.data('paymentForm', () => ({
    cardNumber: '',
    cardMask(input) {
      return input.startsWith('34') || input.startsWith('37')
        ? '9999 999999 99999'
        : '9999 9999 9999 9999';
    },
  }));
});
```
