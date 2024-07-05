const observer = new MutationObserver((mutations, obs) => {
  if (document.querySelector('.product-block')) {
    processProductCards();
  }
});

const UnStrategy = {
  calculate: (price, units) => Math.round(price / units),
  getUnit: () => 'Unidad',
};

const KgStrategy = {
  calculate: (price, weight) => Math.round(price / weight),
  getUnit: () => 'Kg',
};

const GStrategy = {
  calculate: (price, weight) => {
    const weightInKg = weight / 1000; // Convert grams to kilograms
    return Math.round(price / weightInKg);
  },
  getUnit: () => 'Kg' /* Final unit after conversion*/,
};

class UnitMatcherRegistry {
  constructor() {
    this.registry = [];
  }

  register(pattern, strategy) {
    this.registry.push({ pattern, strategy });
  }

  match(productName) {
    for (const { pattern, strategy } of this.registry) {
      const match = productName.match(pattern);
      if (match) {
        return { match, strategy };
      }
    }
    return null;
  }
}

const unitMatcherRegistry = new UnitMatcherRegistry();
unitMatcherRegistry.register(/(\d+)\sUn/, new UnStrategy());
unitMatcherRegistry.register(/(\d+(?:\.\d+)?)\s(kg)/, new KgStrategy());
unitMatcherRegistry.register(/(\d+(?:\.\d+)?)\s(g)/, new GStrategy());

function processProductCards() {
  const productCards = document.querySelectorAll('.product-block');

  if (productCards.length > 0) {
    productCards.forEach((card) => {
      const productName = card.querySelector('h2').innerText;
      const priceElement = card.querySelector('.product-card__sale-price span');
      const priceText = priceElement.innerText;
      const price = parseFloat(
        priceText.replace('$', '').replace('.', '').replace(',', '.')
      );

      const matchResult = unitMatcherRegistry.match(productName);

      if (matchResult) {
        const { match, strategy } = matchResult;
        const quantity = parseFloat(match[1]);
        const unitPrice = strategy.calculate(price, quantity);

        const unitPriceElement = document.createElement('div');

        unitPriceElement.innerText = `Precio por ${strategy.getUnit()}: $${unitPrice}`;
        unitPriceElement.classList.add('product-description');
        priceElement.parentElement.appendChild(unitPriceElement);
      }
    });

    observer.disconnect();
  }
}

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
