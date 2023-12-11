const countries = [
  { country: "India", offset: "+5.5" },
  { country: "China", offset: "+8" },
  { country: "Russia", offset: "+3" },
  { country: "Usa", offset: "-5" },
  { country: "Australia", offset: "+11" },
  { country: "Brazil", offset: "-3" },
  { country: "Canada", offset: "-5" },
  { country: "Germany", offset: "+1" },
  { country: "Japan", offset: "+9" },
  { country: "France", offset: "+1" },
  { country: "Uk", offset: "+0" },
  { country: "Indonesia", offset: "+7" },
  { country: "South Korea", offset: "+9" },
  { country: "Argentina", offset: "-3" },
  { country: "Egypt", offset: "+2" },
  { country: "Israel", offset: "+2" },
  { country: "Italy", offset: "+1" },
  { country: "Spain", offset: "+1" },
  { country: "Switzerland", offset: "+1" },
  { country: "Uae", offset: "+4" },
]

// set the date we are counting down to
var countDown = new Date("jan 1, 2024 00:00:00").getTime();

//update the count down in every 1 second

window.onload = function() {
  timer();
};



function timer() {
  var update = setInterval(function () {

    var x = document.getElementById("time");
    var y = document.getElementById("celebrations");
    var title = document.getElementById("title");
    var bg_img = document.getElementById("bg_img");
    var cat_rest_img = document.getElementById("cat_rest_img");
    var country = document.getElementById("countries").value;

    // get the today's date and time
    //var now = new Date().getTime();

    for (let i = 0; i < countries.length; i++) {
      if (country == countries[i].country) {
        var offset = countries[i].offset;
        break;
      }
    }
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * offset));
    console.log("The local time in " + country + " is " + nd.toLocaleString());

    //find the difference b/w countDown and now
    var diff = countDown - nd;

    //now we are calculating time in days, hrs, minutes, and seconds.
    var days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    var hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    var seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

    //now output the result in an element with id ="time"
    // Show the output time
    document.getElementById("day").innerHTML = days;
    document.getElementById("hour").innerHTML = hrs;
    document.getElementById("minute").innerHTML = minutes;
    document.getElementById("second").innerHTML = seconds;

    if (diff <= 0) {
      clearInterval(update);
      x.style.display = "none";
      title.style.display = "none";
      bg_img.style.display = "none";
      cat_rest_img.style.display = "none";
      y.style.display = "block";
    }
    else {
      x.style.display = "block";
      title.style.display = "block";
      bg_img.style.display = "block";
      cat_rest_img.style.display = "block";
      y.style.display = "none";
    }
  }, 1000);
}



// document.addEventListener("DOMContentLoaded", function () {
//   var infoDiv = document.getElementById("info-div");
//   var mainContent = document.getElementById("main-content");

//   // Display the information initially
//   infoDiv.style.display = "block";

//   function enableMainContent() {
//     // Hide the information
//     infoDiv.style.display = "none";
//     // Enable pointer events for the main content
//     mainContent.style.pointerEvents = "auto";
//   }

//   // Attach the enableMainContent function to the button click event
//   document.querySelector('.information button').addEventListener('click', enableMainContent);
// });



// fireworks animation js
// helper functions
const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0
const timestamp = _ => new Date().getTime()

// container
class Birthday {
  constructor() {
    this.resize()

    // create a lovely place to store the firework
    this.fireworks = []
    this.counter = 0

  }

  resize() {
    this.width = canvas.width = window.innerWidth
    let center = this.width / 2 | 0
    this.spawnA = center - center / 4 | 0
    this.spawnB = center + center / 4 | 0

    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * .1
    this.spawnD = this.height * .5

  }

  onClick(evt) {
    let x = evt.clientX || evt.touches && evt.touches[0].pageX
    let y = evt.clientY || evt.touches && evt.touches[0].pageY

    let count = random(3, 5)
    for (let i = 0; i < count; i++) this.fireworks.push(new Firework(
      random(this.spawnA, this.spawnB),
      this.height,
      x,
      y,
      random(0, 260),
      random(30, 110)))

    this.counter = -1

  }

  update(delta) {
    // ctx.globalCompositeOperation = 'hard-light'
    ctx.fillStyle = `rgba(255,255,255,${8 * delta})`
    ctx.fillRect(0, 0, this.width, this.height)

    ctx.globalCompositeOperation = 'hard-light'
    for (let firework of this.fireworks) firework.update(delta)

    // if enough time passed... create new new firework
    this.counter += delta * 3 // each second
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)))
      this.counter = 0
    }

    // remove the dead fireworks
    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead)

  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false
    this.offsprings = offsprings

    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY

    this.shade = shade
    this.history = []
  }
  update(delta) {
    if (this.dead) return

    let xDiff = this.targetX - this.x
    let yDiff = this.targetY - this.y
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
      this.x += xDiff * 2 * delta
      this.y += yDiff * 2 * delta

      this.history.push({
        x: this.x,
        y: this.y
      })

      if (this.history.length > 20) this.history.shift()

    } else {
      if (this.offsprings && !this.madeChilds) {

        let babies = this.offsprings / 2
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0

          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))

        }

      }
      this.madeChilds = true
      this.history.shift()
    }

    if (this.history.length === 0) this.dead = true
    else if (this.offsprings) {
      for (let i = 0; this.history.length > i; i++) {
        let point = this.history[i]
        ctx.beginPath()
        ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)'
        ctx.arc(point.x, point.y, 1, 0, PI2, false)
        ctx.fill()
      }
    } else {
      ctx.beginPath()
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)'
      ctx.arc(this.x, this.y, 1, 0, PI2, false)
      ctx.fill()
    }

  }
}

let canvas = document.getElementById('birthday')
let ctx = canvas.getContext('2d')

let then = timestamp()

let birthday = new Birthday
window.onresize = () => birthday.resize()
document.onclick = evt => birthday.onClick(evt)
document.ontouchstart = evt => birthday.onClick(evt)

  ; (function loop() {
    requestAnimationFrame(loop)

    let now = timestamp()
    let delta = now - then

    then = now
    birthday.update(delta / 1000)


  })()