// Close button: postMessage to parent or go back
document.getElementById('closeBtn').addEventListener('click', function () {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'closeTrillionOverlay' }, '*');
  } else {
    window.history.back();
  }
});
