/* ── mobile-nav toggle ───────────────────────────────────── */
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open');
});

/* ── booking-form logic ─────────────────────────────────── */
const form  = document.getElementById('bookingForm');
const toast = document.getElementById('formToast');

if (form && toast) {
  const endpoint = form.action;
  const btn      = form.querySelector('button');
  const nameFld  = document.getElementById('name');
  const phoneFld = document.getElementById('phone');
  const emailFld = document.getElementById('email');

  /* live phone filter: digits only */
  phoneFld.addEventListener('input', () => {
    phoneFld.value = phoneFld.value.replace(/[^0-9]/g, '');
  });

  /* custom validity + error text */
  const checks = {
    name:  {
      field: nameFld,
      errEl: document.getElementById('nameErr'),
      msg:   'Enter your first & last name (letters only).'
    },
    phone: {
      field: phoneFld,
      errEl: document.getElementById('phoneErr'),
      msg:   'Phone must be 10–15 digits, no symbols or spaces.'
    },
    email: {
      field: emailFld,
      errEl: document.getElementById('emailErr'),
      msg:   'Please enter a valid email like name@example.com.'
    }
  };

  /* attach handlers */
  Object.values(checks).forEach(({ field, errEl, msg }) => {
    field.addEventListener('invalid', () => {
      field.setCustomValidity(msg);
      errEl.textContent = msg;
    });
    field.addEventListener('input', () => {
      field.setCustomValidity('');
      errEl.textContent = '';
    });
  });

  /* main submit */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* run browser validation first */
    if (!form.reportValidity()) return;

    const data = new FormData(form);

    /* honeypot spam trap */
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

  /* toast helper */
  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle('error', isError);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
}
