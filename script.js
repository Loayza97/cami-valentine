const photoStages = [
    "photos/foto1.jpg",  // 0 start
    "photos/foto2.jpg",  // 1
    "photos/foto3.jpg",  // 2
    "photos/foto4.jpg",  // 3
    "photos/foto5.jpg",  // 4
    "photos/foto6.jpg",  // 5
    "photos/foto7.jpg"   // 6
]

// object-position per photo: [horizontal, vertical]
const photoPositions = [
    "center center",  // foto1
    "center center",  // foto2
    "center 25%",     // foto3 - mostrar mas arriba (cabeza novia)
    "center center",  // foto4
    "center 25%",     // foto5 - mostrar mas arriba (cabezas)
    "center center",  // foto6 - centrar ambos
    "center center"   // foto7
]

const gifStages = [
    "https://media1.tenor.com/m/_x26F5nuswMAAAAC/open-season-boog.gif",    // 0 happy - Boog & Elliot together
    "https://media1.tenor.com/m/PATjcQ81q4kAAAAC/open-season-boog.gif",    // 1 confused - Boog "what now?"
    "https://media1.tenor.com/m/Y31hGXA1jjkAAAAC/open-season-boog.gif",    // 2 disbelief - "this ain't happening"
    "https://media1.tenor.com/m/6I9c_4dIBfYAAAAC/open-season-boog.gif",    // 3 sad - Boog in darkness
    "https://media1.tenor.com/m/ibeGyjNM6OoAAAAC/sad-bear.gif",            // 4 crying - sad bear walking
    "https://media1.tenor.com/m/QVU4TcXPB0EAAAAC/open-season-boog.gif",    // 5 devastated - "can't take it anymore"
    "https://media1.tenor.com/m/SiljPQyTGjsAAAAC/open-season-boog.gif"     // 6 runaway - "stop messing up my life"
]

const noMessages = [
    "No",
    "Deberias decir que si 🤔",
    "Si no me amas solo dilo... 🥺",
    "Estoy a punto de irme a llorar con mi gato 😢",
    "Me odias cierto? 💔",
    "Soy un oso acongojao 😭",
    "No me puedes atrapar 😜"
]

const yesTeasePokes = [
    "primero dale no... apuesto que quieres saber que pasa 😏",
    "dale, presiona no... solo una vez 👀",
    "te lo estas perdiendo 😈",
    "dale no, te reto 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const couplePhoto = document.getElementById('couple-photo')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap photo through stages
    const photoIndex = Math.min(noClickCount, photoStages.length - 1)
    swapPhoto(photoStages[photoIndex])

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapPhoto(src) {
    const photoIndex = photoStages.indexOf(src)
    const position = photoPositions[photoIndex] || "center center"
    couplePhoto.style.opacity = '0'
    setTimeout(() => {
        couplePhoto.src = src
        couplePhoto.style.objectPosition = position
        couplePhoto.style.opacity = '1'
    }, 200)
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
