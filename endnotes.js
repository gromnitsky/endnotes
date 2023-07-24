let opt = {
    width: () => window.innerWidth - 300 < 100 ? window.innerWidth - 60 : 300,
    height: 150,
    ref: href => {
        let hash = new URL(href).hash
        let ref = document.querySelector(hash)
        return ref?.innerHTML || 'invalid ref'
    },
    before_hook: null,
    after_hook: null
}

let id = {
    wrapper: "footnotes_dialog_12c1b560",
    get content() { return this.wrapper + '_content' }
}

export default function(css_selector, options) {
    Object.assign(opt, options)
    document.querySelectorAll(css_selector).forEach( node => {
        node.addEventListener('mouseover', is_mobile() ? dialog_create : debounce(dialog_create))
        node.addEventListener('mouseout', dialog_remove)
        node.addEventListener('click', e => e.preventDefault())
    })
}

function dialog_create(event) {
    // don't show the dialog if a user just quickly moved a mouse
    // cursor over a link
    if (!event.target.matches(':hover')) return

    let width = opt.width()
    let padding = 16
    let border = 1
    let scrollbar = 16 // a guess
    let width_total = width + padding*2 + border*2 + scrollbar
    let height = opt.height
    let trasparent_margin = 20
    let height_total = height + padding*2 + border*2 + trasparent_margin*2
    let x = event.x - width_total/2
    let y = event.y

    // this div is transparent
    let wrapper = document.createElement('div')
    wrapper.id = id.wrapper
    wrapper.style.position = 'fixed'
    wrapper.style.left = `${x}px`
    wrapper.style.top =`${y}px`
//    wrapper.style.outline = '1px solid red'

    /* wrapper inner div is not transparent

       +-------------+
       | transparent |
       |+-----------+|
       ||           ||
       ||   dlg     ||
       ||           ||
       |+-----------+|
       | transparent |
       +-------------+
    */
    wrapper.innerHTML = `<div id="${id.content}"></div>`
    let dlg = wrapper.querySelector('#' +id.content)
    dlg.style.marginTop = trasparent_margin + 'px'
    dlg.style.marginBottom = trasparent_margin + 'px'
    dlg.style.border = `1px solid lightgray`
    dlg.style.boxShadow = 'rgba(100, 100, 111, 0.5) 0px 7px 14px 0px'
    dlg.style.borderRadius = '5px'
    dlg.style.background = 'white'
    dlg.style.color = '#191919'
    dlg.style.padding = padding + 'px'
    dlg.style.overflowY = 'auto'
    dlg.style.width = width + 'px'
    dlg.style.height = height + 'px'

    // fix coordinates if a mouse cursor is too close to the viewport edges
    if (x < 0) wrapper.style.left = '0px'
    if (window.innerWidth - x < width_total)
        wrapper.style.left = (window.innerWidth - width_total) + 'px'
    if (window.innerHeight - y < height_total) {
        // first, try position the popup above the link
        wrapper.style.top = (y - height_total) + 'px'
        // second, if there is no space above, stick it to the bottom
        if (y - height_total < 0)
            wrapper.style.top = (window.innerHeight - height_total) + 'px'
    }

    dlg.innerHTML = opt.ref(this.href)

    wrapper.addEventListener('mouseout', dialog_remove2)

    if (opt.before_hook) opt.before_hook(event.target)
    document.querySelector('body').appendChild(wrapper)
}

function dialog_remove(event) {
    let dlg = document.querySelector('#' + id.wrapper)
    if (!dlg || dlg.matches(':hover')) return

    document.querySelectorAll('#' + id.wrapper).forEach( div => {
        if (dlg === event?.relatedTarget) return
        div.remove()
    })
    if (opt.after_hook) opt.after_hook(event.target)
}

function dialog_remove2(event) {
    let removed = false
    document.querySelectorAll('#' + id.wrapper).forEach( div => {
        if (event?.relatedTarget?.closest('#' + id.content)) {
            // do nothing: mouseout event was fired because a cursor
            // entered a child element (<a> for example) withing the
            // dialog
        } else {
            div.remove()
            removed = true
        }
    })
    if (removed && opt.after_hook) opt.after_hook(event.target)
}

function debounce(fn, ms = 250) {
    let timeout_id
    return function(...args) {
        clearTimeout(timeout_id)
        timeout_id = setTimeout(() => fn.apply(this, args), ms)
    }
}

function is_mobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}
