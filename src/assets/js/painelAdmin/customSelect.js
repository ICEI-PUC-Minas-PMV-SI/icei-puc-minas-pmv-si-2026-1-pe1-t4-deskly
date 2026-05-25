document.querySelectorAll('.custom-select').forEach(select => {
  const trigger = select.querySelector('.custom-select-trigger');
  const label = select.querySelector('.custom-select-label');
  const options = select.querySelectorAll('.custom-select-option');

  trigger.addEventListener('click', () => {
    const isOpen = select.classList.contains('open');
    document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
    if (!isOpen) select.classList.add('open');
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      label.textContent = option.textContent;
      select.classList.remove('open');
    });
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.custom-select')) {
    document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
  }
});