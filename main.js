var swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

swiper.on('slideChangeTransitionEnd', function () {
  var selectedImg = document.getElementById('selectedImage');
  var activeSlide = swiper.slides[swiper.activeIndex];
  var activeImg = activeSlide.querySelector('img');

  selectedImg.querySelector('img').src = activeImg.src;
});

var discountCode = '';

function checkDiscountCode() {
  var inputDiscountCode = document.getElementById('discountCode');
  discountCode = inputDiscountCode.value;
}

function showConfirmationModal() {
  var confirmationModal = document.getElementById('confirmationModal');
  var selectedProductName = document.getElementById('selectedProductName');
  var totalAmount = document.getElementById('totalAmount');
  var shippingFee = document.getElementById('shippingFee');
  var totalPayment = document.getElementById('totalPayment');
  var customerName = document.getElementById('customerName');
  var customerAddress = document.getElementById('customerAddress');
  var customerPhoneNumber = document.getElementById('customerPhoneNumber');
  var quantity = document.getElementById('quantity');

  var selectedSlide = swiper.slides[swiper.activeIndex];
  var orderForm = document.getElementById('orderForm');
  var productPrice = parseFloat(selectedSlide.getAttribute('data-product-price').replace(',', ''));
  var shippingFeeAmount = 20000;
  var totalAmountValue = productPrice * quantity.value;
  var totalPaymentValue = totalAmountValue + shippingFeeAmount;

  selectedProductName.textContent = selectedSlide.getAttribute('data-product-name');
  totalAmount.textContent = 'Tiền hàng: ' + formatCurrency(totalAmountValue);
  shippingFee.textContent = 'Phí vận chuyển: ' + formatCurrency(shippingFeeAmount);
  totalPayment.textContent = 'Tổng thanh toán: ' + formatCurrency(totalPaymentValue);
  customerName.textContent = 'Tên khách hàng: ' + orderForm.fullName.value;
  customerAddress.textContent = 'Địa chỉ: ' + orderForm.address.value;
  customerPhoneNumber.textContent = 'Số điện thoại: ' + orderForm.phoneNumber.value;

  confirmationModal.style.display = 'flex';
}

function hideConfirmationModal() {
  var confirmationModal = document.getElementById('confirmationModal');
  confirmationModal.style.display = 'none';
}

function sendOrder() {
  const orderInfo = {
    productName: document.getElementById('selectedProductName').textContent,
    totalAmount: document.getElementById('totalAmount').textContent,
    shippingFee: document.getElementById('shippingFee').textContent,
    customerName: document.getElementById('customerName').textContent,
    customerAddress: document.getElementById('customerAddress').textContent,
    customerPhoneNumber: document.getElementById('customerPhoneNumber').textContent,
  };

  sendToTelegram(orderInfo);

  hideConfirmationModal();
  var successMessage = document.getElementById('successMessage');
  successMessage.style.display = 'block';
  clearSelectedImage();
  resetForm();
}

function clearSelectedImage() {
  var selectedImage = document.getElementById('selectedImage');
  selectedImage.style.display = 'none';
}

function resetForm() {
  var orderForm = document.getElementById('orderForm');
  orderForm.reset();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function sendToTelegram(orderInfo) {
  const telegramBotToken = '6525730844:AAGj15TJV59qozfV6vZZD8Cmr85hHc8-Lcc';
  const chatId = '-1002042330395';

  const message = `
    🛒 **Đơn Hàng Mới**
    📦 *Tên mặt hàng: ${orderInfo.productName}*
    💵 *${orderInfo.totalAmount}*
    🚚 *${orderInfo.shippingFee}*
    👤 *${orderInfo.customerName}*
    📍 *${orderInfo.customerAddress}*
    📱 *${orderInfo.customerPhoneNumber}*
    🕒 *Ngày, giờ đặt hàng: ${new Date().toLocaleString('vi-VN')}*
  `;

  const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

  fetch(apiUrl, { method: 'GET' })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error sending message to Telegram:', error));
    }
