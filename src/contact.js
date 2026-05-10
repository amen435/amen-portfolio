import emailjs from '@emailjs/browser';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const statusEl = document.getElementById('form-status');

  if (!form) return;

  // Initialize EmailJS with your public key.
  // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key.
  emailjs.init("YOUR_PUBLIC_KEY");

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    btn.textContent = 'TRANSMITTING...';
    btn.style.opacity = '0.7';
    btn.disabled = true;
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    // Replace these IDs with your actual EmailJS Service ID and Template ID.
    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
    emailjs.sendForm('default_service', 'template_amen', this)
      .then(() => {
        btn.textContent = 'TRANSMISSION SUCCESS';
        statusEl.textContent = '[ SYSTEM MSG ]: Message delivered securely.';
        statusEl.classList.add('success');
        form.reset();
        setTimeout(() => {
          btn.textContent = 'TRANSMIT MESSAGE ↗';
          btn.style.opacity = '1';
          btn.disabled = false;
        }, 4000);
      }, (error) => {
        console.error('FAILED...', error);
        btn.textContent = 'TRANSMIT MESSAGE ↗';
        btn.style.opacity = '1';
        btn.disabled = false;
        statusEl.textContent = '[ SYSTEM ERROR ]: Delivery failed. Try again.';
        statusEl.classList.add('error');
      });
  });
}
