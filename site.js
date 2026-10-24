// The gallery's lightbox: a click on any screenshot opens it big; arrows step through, Esc or a click outside closes.
const shots = [...document.querySelectorAll('.shot')]
const box = document.querySelector('.lightbox')
const img = box.querySelector('img'), cap = box.querySelector('figcaption')
let at = 0

function show(i) {
  at = (i + shots.length) % shots.length
  img.src = shots[at].href
  img.alt = shots[at].querySelector('img').alt
  cap.textContent = shots[at].dataset.caption
}
shots.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); show(i); box.showModal() }))
box.querySelector('.lb-prev').onclick = () => show(at - 1)
box.querySelector('.lb-next').onclick = () => show(at + 1)
box.querySelector('.lb-close').onclick = () => box.close()
box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'FIGURE') box.close() })
box.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(at - 1)
  if (e.key === 'ArrowRight') show(at + 1)
})
