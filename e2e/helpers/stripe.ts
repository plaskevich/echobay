import type { Page } from '@playwright/test';

const STRIPE_INIT_SCRIPT = `
(function() {
  var createdElements = {};

  function createMockElement(type) {
    var handlers = {};
    return {
      _type: type,
      _handlers: handlers,
      mount: function(node) {
        if (node) node.textContent = 'Mock card element';
        setTimeout(function() {
          if (handlers.ready) handlers.ready({ elementType: type });
        }, 10);
      },
      unmount: function() {},
      destroy: function() {},
      on: function(ev, fn) { handlers[ev] = fn; return this; },
      off: function(ev) { delete handlers[ev]; return this; },
      update: function() { return this; },
    };
  }

  var mockPaymentIntent = { id: 'pi_mock_test_123', status: 'succeeded' };

  window.Stripe = function() {
    return {
      elements: function() {
        return {
          create: function(type) {
            var el = createMockElement(type);
            createdElements[type] = el;
            return el;
          },
          getElement: function(ref) {
            var type = typeof ref === 'string' ? ref
              : (ref && ref.__elementType) ? ref.__elementType
              : 'card';
            return createdElements[type] || null;
          },
          update: function() {},
        };
      },
      confirmCardPayment: function() {
        return Promise.resolve({ paymentIntent: mockPaymentIntent });
      },
      createToken: function() {
        return Promise.resolve({ token: { id: 'tok_mock_123' } });
      },
      createPaymentMethod: function() {
        return Promise.resolve({ paymentMethod: { id: 'pm_mock_123' } });
      },
      retrievePaymentIntent: function() {
        return Promise.resolve({ paymentIntent: mockPaymentIntent });
      },
    };
  };

  var origCreateElement = document.createElement.bind(document);
  var srcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');

  document.createElement = function(tagName) {
    var el = origCreateElement(tagName);
    if (tagName.toLowerCase() !== 'script') return el;

    Object.defineProperty(el, 'src', {
      set: function(value) {
        if (typeof value === 'string' && value.indexOf('stripe.com') !== -1) {
          setTimeout(function() { el.dispatchEvent(new Event('load')); }, 0);
          return;
        }
        srcDescriptor.set.call(el, value);
      },
      get: function() { return srcDescriptor.get.call(el); },
      configurable: true,
    });
    return el;
  };
})();
`;

export async function setupStripeMock(page: Page) {
  await page.addInitScript(STRIPE_INIT_SCRIPT);

  await page.route('https://js.stripe.com/**', async (route) => {
    await route.abort();
  });

  await page.route('**/functions/v1/create-payment-intent', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        clientSecret: 'pi_mock_test_123_secret_mock',
        paymentIntentId: 'pi_mock_test_123',
      }),
    });
  });

  await page.route('**/functions/v1/confirm-payment', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        orderId: 'mock-order-id',
      }),
    });
  });
}
