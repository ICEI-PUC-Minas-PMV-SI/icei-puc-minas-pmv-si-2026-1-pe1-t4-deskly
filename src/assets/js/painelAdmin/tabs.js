const tabs = document.querySelectorAll('.tab')
const indicator = document.querySelector('.tab-indicator')

function moveIndicator(tab) {
  indicator.style.width = `${tab.offsetWidth}px`
  indicator.style.left = `${tab.offsetLeft}px`
}

const activeTab = document.querySelector('.tab.active')
if (activeTab) {
  moveIndicator(activeTab)
  document.querySelectorAll(`[data-tab-content="${activeTab.dataset.tab}"]`)
    .forEach(s => s.classList.add('active'))
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('.tab.active')?.classList.remove('active')
    tab.classList.add('active')
    moveIndicator(tab)

    document.querySelectorAll('[data-tab-content]').forEach(s => s.classList.remove('active'))
    document.querySelectorAll(`[data-tab-content="${tab.dataset.tab}"]`).forEach(s => s.classList.add('active'))
  })
})

window.addEventListener('resize', () => {
  const current = document.querySelector('.tab.active')
  if (current) moveIndicator(current)
})