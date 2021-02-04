const loginForm = `<p class="text-logo form-logo">Filmoteka</p><label>
              <input
                type="email"
                name="login-email"
                autocomplete="off"
                placeholder="Email"
                class="auth-input"
                required
              />
            </label>
            <br />
            <label>
              <input
                name="login-password"
                type="password"
                placeholder="Password"
                class="auth-input"
                required
              />
            </label>
            <br /> <button type="submit" class="auth-btn">Login</button>
         `;

export function init() {
  const loginRef = document.querySelector('.js-login');
  const backdropRef = document.querySelector('.js-backdrop');
  const loginFormRef = document.querySelector('.js-login-form');

  loginRef.addEventListener('click', onOpenLoginModal);
  backdropRef.addEventListener('click', onBackDropClick);

  function onOpenLoginModal() {
    window.addEventListener('keydown', onPressEscape);
    loginFormRef.insertAdjacentHTML('beforeend', loginForm);
    backdropRef.classList.remove('hidden');
  }

  function onCloseModal() {
    window.removeEventListener('keydown', onPressEscape);
    backdropRef.classList.add('hidden');
    loginFormRef.innerHTML = '';
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
