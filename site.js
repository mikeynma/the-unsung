// The lightbox: a click on any screenshot opens it big; arrows step through,
// Esc or a click outside closes. Zoom: + and - (buttons or keys), 0 or Fit,
// the wheel, a double click; drag to look round when zoomed (a finger just
// scrolls). Small print, such as an inlay's leaflet, wants it.
const shots = [...document.querySelectorAll('.shot, .inlay-pic')]   // the inlay opens here too
const box = document.querySelector('.lightbox')
const img = box.querySelector('img'), cap = box.querySelector('figcaption')
const view = box.querySelector('.lb-view')
let at = 0, zoom = 1

// zoom 1 is the picture fitted to the view (never larger than itself); more
// zooms round the point (px, py) on screen, keeping it under the pointer
function fitScale() { return Math.min(1, view.clientWidth / img.naturalWidth, view.clientHeight / img.naturalHeight) }
function setZoom(z, px, py) {
  const f = fitScale() || 1
  z = Math.max(1, Math.min(Math.max(4, 3 / f), z))
  const vr = view.getBoundingClientRect()
  if (px === undefined) { px = vr.left + vr.width / 2; py = vr.top + vr.height / 2 }
  const ir = img.getBoundingClientRect()
  const fx = (px - ir.left) / ir.width, fy = (py - ir.top) / ir.height
  zoom = z
  view.classList.toggle('zoomed', z > 1)
  img.style.width = z > 1 ? Math.round(img.naturalWidth * f * z) + 'px' : ''
  if (z > 1) {
    const nr = img.getBoundingClientRect()
    view.scrollLeft += nr.left + fx * nr.width - px
    view.scrollTop += nr.top + fy * nr.height - py
  }
}
box.querySelector('.lb-in').onclick = () => setZoom(zoom * 1.5)
box.querySelector('.lb-out').onclick = () => setZoom(zoom / 1.5)
box.querySelector('.lb-fit').onclick = () => setZoom(1)
view.addEventListener('wheel', e => { e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.25 : 0.8), e.clientX, e.clientY) }, { passive: false })
view.addEventListener('dblclick', e => zoom > 1 ? setZoom(1) : setZoom(2.5, e.clientX, e.clientY))
let drag = null, dragged = false
view.addEventListener('pointerdown', e => {
  if (zoom === 1 || e.pointerType !== 'mouse') return
  drag = { x: e.clientX, y: e.clientY, l: view.scrollLeft, t: view.scrollTop }; dragged = false
  view.setPointerCapture(e.pointerId); view.classList.add('dragging')
})
view.addEventListener('pointermove', e => {
  if (!drag) return
  if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 3) dragged = true
  view.scrollLeft = drag.l - (e.clientX - drag.x); view.scrollTop = drag.t - (e.clientY - drag.y)
})
view.addEventListener('pointerup', () => { drag = null; view.classList.remove('dragging') })

function show(i) {
  at = (i + shots.length) % shots.length
  zoom = 1; view.classList.remove('zoomed'); img.style.width = ''
  img.src = shots[at].href
  img.alt = shots[at].querySelector('img').alt
  cap.textContent = shots[at].dataset.caption
}
shots.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); show(i); box.showModal() }))
box.querySelector('.lb-prev').onclick = () => show(at - 1)
box.querySelector('.lb-next').onclick = () => show(at + 1)
box.querySelector('.lb-close').onclick = () => box.close()
box.addEventListener('click', e => {
  if (dragged) { dragged = false; return }   // the end of a drag is not a click outside
  if (e.target === box || e.target.tagName === 'FIGURE' || (e.target === view && zoom === 1)) box.close()
})
box.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') show(at - 1)
  if (e.key === 'ArrowRight') show(at + 1)
  if (e.key === '+' || e.key === '=') setZoom(zoom * 1.5)
  if (e.key === '-') setZoom(zoom / 1.5)
  if (e.key === '0') setZoom(1)
})
