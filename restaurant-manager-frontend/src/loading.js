let spinner;

export const showLoading = () => {
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.innerHTML = '<div class="spinner">Loading...</div>'; 
    spinner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 20px;
      z-index: 9999;
    `;
    document.body.appendChild(spinner);
  }
};

export const hideLoading = () => {
  if (spinner) {
    document.body.removeChild(spinner);
    spinner = null;
  }
};
