const signupForm = `<p class="text-logo form-logo">Filmoteka</p><label>
              <input
                type="email"
                name="email"
                autocomplete="off"
                placeholder="Email"
                class="auth-input"
                required
              />
            </label>
            <br />
            <label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                class="auth-input"
                required
              />
            </label>
            <br />
            <button type="submit" class="auth-btn">Sign up</button>
         `;

export function init() {
  const signupRef = document.querySelector('.js-signup');
  const backdropRef = document.querySelector('.js-backdrop');
  const authFormRef = document.querySelector('.js-register-form');

  signupRef.addEventListener('click', onOpenAuthModal);
  backdropRef.addEventListener('click', onBackDropClick);

  function onOpenAuthModal() {
    window.addEventListener('keydown', onPressEscape);
    authFormRef.insertAdjacentHTML('beforeend', signupForm);
    backdropRef.classList.remove('hidden');
  }

  function onCloseModal() {
    window.removeEventListener('keydown', onPressEscape);
    backdropRef.classList.add('hidden');
    authFormRef.innerHTML = '';
  }

  function onBackDropClick(event) {
    if (event.target === event.currentTarget) {
      onCloseModal();
    }
  }

  function onPressEscape(event) {
    if (event.code === 'Escape') {
      onCloseModal();
    }
  }
}
