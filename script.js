// ─── mobile menu (unchanged) ───────────────────────────────
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
  
  // ─── booking form logic ────────────────────────────────────
  const form  = document.getElementById('bookingForm');
  const toast = document.getElementById('formToast');
  
  if (form && toast) {
    const endpoint = form.action;
    const btn      = form.querySelector('button');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
  
      // honeypot check
      if (data.get('website')) return;
  
      btn.disabled   = true;
      btn.textContent = 'Sending…';
  
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data });
        if (res.ok) {
          form.reset();
          showToast('Thank you! We’ll be in touch shortly.');
        } else {
          throw new Error(`Server responded ${res.status}`);
        }
      } catch (err) {
        console.error(err);
        showToast('Oops – please try again or email us.', true);
      } finally {
        btn.disabled   = false;
        btn.textContent = 'Claim Your Discounted Session';
      }
    });
  
    function showToast(message, isError = false) {
      toast.textContent = message;
      toast.classList.toggle('error', isError);
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }
  