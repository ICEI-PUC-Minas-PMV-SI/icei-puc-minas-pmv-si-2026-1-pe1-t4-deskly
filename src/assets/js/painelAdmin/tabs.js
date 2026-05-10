const tabs = document.querySelectorAll('.tab')
const indicator = document.querySelector('.tab-indicator')

function moveIndicator(tab) {
  indicator.style.width = `${tab.offsetWidth}px`
  indicator.style.left = `${tab.offsetLeft}px`
}

const activeTab = document.querySelector('.tab.active')
if (activeTab) moveIndicator(activeTab)

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelector('.tab.active')?.classList.remove('active')
    tab.classList.add('active')
    moveIndicator(tab)
  })
})