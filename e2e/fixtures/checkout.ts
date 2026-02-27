import type { Page } from '@playwright/test';

export const CHECKOUT_SELLER_EMAIL = 'checkout-seller@echobay.local';

export const SHIPPING_DATA = {
  fullName: 'Test User',
  addressLine1: '123 Test Street',
  addressLine2: 'Apt 4B',
  city: 'Berlin',
  postalCode: '10115',
  country: 'DE',
  phone: '+49 30 12345678',
} as const;

export async function fillShippingForm(page: Page) {
  await page.getByTestId('shipping-fullname-input').fill(SHIPPING_DATA.fullName);
  await page.getByTestId('shipping-address1-input').fill(SHIPPING_DATA.addressLine1);
  await page.getByTestId('shipping-address2-input').fill(SHIPPING_DATA.addressLine2);
  await page.getByTestId('shipping-city-input').fill(SHIPPING_DATA.city);
  await page.getByTestId('shipping-postalcode-input').fill(SHIPPING_DATA.postalCode);
  await page.getByTestId('shipping-country-select').selectOption(SHIPPING_DATA.country);
  await page.getByTestId('shipping-phone-input').fill(SHIPPING_DATA.phone);
}
