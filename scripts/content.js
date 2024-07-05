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
      const price = parseFloat(priceText.replace('$', '').replace('.', ''));

      // Assuming the format "ProductName X Un, Y g" to extract units
      const unitsMatch = productName.match(/(\d+)\sUn/);

      if (unitsMatch && unitsMatch.length > 1) {
        const units = parseInt(unitsMatch[1], 10);
        const unitPrice = Math.round(price / units);

        const unitPriceElement = document.createElement('div');
        unitPriceElement.innerText = `Precio por unidad: $${unitPrice}`;
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
