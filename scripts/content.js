const observer = new MutationObserver((mutations, obs) => {
  if (document.querySelector('.product-block')) {
    processProductCards();
  }
});

function processProductCards() {
  const productCards = document.querySelectorAll('.product-block');

  if (productCards.length > 0) {
    console.log('Hello from content.js');

    productCards.forEach((card) => {
      const productName = card.querySelector('h2').innerText;
      const priceElement = card.querySelector('.product-card__sale-price span');
      const priceText = priceElement.innerText;
      const price = parseFloat(
        priceText.replace('$', '').replace('.', '').replace(',', '.')
      );

      // Enhanced regex to match units in "Un", "kg", and "g"
      const unitsMatch = productName.match(/(\d+)\sUn|(\d+(?:\.\d+)?)\s(kg|g)/);

      if (unitsMatch) {
        let unitPrice;
        if (unitsMatch[3] === 'kg') {
          // If the unit is in kilograms
          const weightInKg = parseFloat(unitsMatch[2]);
          unitPrice = Math.round(price / weightInKg);
        } else if (unitsMatch[3] === 'g') {
          // If the unit is in grams
          const weightInKg = parseFloat(unitsMatch[2]) / 1000; // Convert grams to kilograms
          unitPrice = Math.round(price / weightInKg);
        } else if (unitsMatch[1]) {
          // If the unit is in 'Un'
          const units = parseInt(unitsMatch[1], 10);
          unitPrice = Math.round(price / units);
        }

        if (unitPrice) {
          const unitPriceElement = document.createElement('div');

          if (unitsMatch[3] === 'kg' || unitsMatch[3] === 'g') {
            unitPriceElement.innerText = `Precio por kg: $${unitPrice}`;
          } else {
            unitPriceElement.innerText = `Precio por unidad: $${unitPrice}`;
          }

          unitPriceElement.classList.add('product-description');
          priceElement.parentElement.appendChild(unitPriceElement);
        }
      }
    });

    observer.disconnect();
  }
}

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
