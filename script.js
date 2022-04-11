import apiKey from './apiKey.js'
const url = `https://www.omdbapi.com/?apikey=${apiKey}`
const input = document.querySelector('#input-search')
const resultsWrapper = document.querySelector('.research-results')
let options = {
  rootMargin: "-10% 0px", 
  treshold: 0, 
}


// note keyup will grab all the present characters
input.addEventListener('keyup', (e) => {
  e.preventDefault()
  searchMoviesByName(e.target.value)
    .then((data) => {
      let oldResults = document.querySelectorAll('.research-results .movie-result')
      oldResults.forEach((e) => {
        e.remove()
      })
      if (data.Response === 'True') {
        data.Search.forEach((e, index) => {
          // refetch les data pour chacun d'entre eux
          getInformations(e.Title)
            .then((information) => {
              let arrayMoviesResult = document.querySelectorAll('.movie-result');
              // removing duplicates before creating them by filtering the released date movie
              // from each last element I already published
      
              const observer = new IntersectionObserver(handleIntersect, options)
              let condition = true;
              arrayMoviesResult.forEach((e) => {
                let elementReleasedDate = e.querySelector('.movie-header p').innerHTML
                if (elementReleasedDate === information.Released)
                  condition = false
              })

              

              if (data.Response === 'True' && condition === true) {
              let newMovieElem = document.createElement('div')
              newMovieElem.className += 'movie-result'
              newMovieElem.setAttribute("id",`${index}`)
                newMovieElem.innerHTML += `
              <div class="movie-wrapper">
                <div class="movie-image">
                  <img src='${e.Poster} alt=${e.Title}'>
                </div>
                <div class="movie-content">
                  <div class="movie-header">
                    <h2>${e.Title.toUpperCase()}</h2>
                    <p>${information.Released}</p>
                  </div>
                  <div class="btn-read-more" id="${index}">Read more</div>
                </div>
                </div>

                <div class="read-more id-${index}" id="${index}">
                  <div class="close-btn" id="${index}">
                    <img style="width:1.5rem;height:1.5rem;"src="https://img.icons8.com/material/24/000000/delete-sign--v1.png"/>
                  </div>
                  <div class="read-more-image" alt="${e.Title}">
                    <img src=${e.Poster}>
                  </div>
                  <div class="read-more-content">
                    <h2>${e.Title.toUpperCase()}</h2>
                    <p>${information.Released}</p>
                    <p>${information.Plot}</p>
                  </div>
                
           
              `
              resultsWrapper.appendChild(newMovieElem)
            }
          }).then(() => {
            initializeOpenButtons(index)
            initializeCloseButtons(index)
            // lazy loading 
            let arrayMoviesResult = document.querySelectorAll('.movie-result');
            const observer = new IntersectionObserver(handleIntersect, options)
            arrayMoviesResult.forEach((movie) => {
              observer.observe(movie)
            })
          })
        })
      } 
    })
  })

async function searchMoviesByName(name) {
  const response = await fetch(`${url}&s=${name}`)
  const data = await response.json()
  return data
}

async function getInformations(movieName){
  const response = await fetch(`${url}&t=${movieName}`)
  const data = await response.json()
  return data
}

function initializeOpenButtons(index) {
  let movieResultButtonsArray = document.querySelectorAll('.btn-read-more')
  //let moviesResultsArray = document.querySelectorAll('.movie-results')
  //console.log(moviesResultsArray)
  movieResultButtonsArray.forEach((button) => {
    button.addEventListener('click', (event) => {
      let modal = document.querySelector(`.read-more.id-${event.target.getAttribute('id')}`)
      modal.style.display = "flex"
      modal.style.opacity = 1
    })
  })
}

function initializeCloseButtons(index) {
  let closeButtonsArray = document.querySelectorAll('.close-btn')
  closeButtonsArray.forEach((button) => {
    button.addEventListener('click', (event) => {
       let modal = document.querySelector(`.read-more.id-${button.getAttribute('id')}`)
       modal.style.display = "none"
       modal.style.opacity = 0   
    })
  })
}
function handleIntersect(entries){
  console.log(entries)

  entries.forEach((entry) => {
    console.log(entry.isIntersecting)
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1; // .target
    } else {
      entry.target.style.opacity = 0;
    }
  })
}



// NAVBAR 

const div = document.querySelector('.text-wrapper')
    let text = document.getElementById('moving-text')
    let SPEED_TEXT = .03;

    const textWidth = text.getBoundingClientRect().width
    const divWidth = div.getBoundingClientRect().width
    const percentage = (textWidth/divWidth)*100
    let hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"))

    function moveText() {

      // changing the color
      hue += 0.05
      document.documentElement.style.setProperty("--hue", hue)

      
      let getter = parseFloat(getComputedStyle(text).getPropertyValue('--x'))
      let divRight = div.getBoundingClientRect().right
      let textLeft = text.getBoundingClientRect().left
      let textRight = text.getBoundingClientRect().right
      let setter = getter += SPEED_TEXT
      //console.log(getter)
      text.style.setProperty('--x', setter)
      // bad way to handle the second text, would have been better with classes
      let oldText = div.querySelectorAll('.moving-text')[0]
      let oldGetter = parseFloat(getComputedStyle(oldText).getPropertyValue('--x'))
      let oldSetter = oldGetter += SPEED_TEXT
      oldText.style.setProperty('--x', oldSetter)
      let oldTextLeft = div.querySelectorAll('.moving-text')[0].getBoundingClientRect().left

      if ( oldTextLeft > divRight) {
        SPEED_TEXT /= 2 
          div.querySelectorAll('.moving-text')[0].remove()
        } 

      if (textRight > divRight) {
        SPEED_TEXT *= 2
        let lastTextContent = text.innerHTML
        let tagContent = document.createElement("p");
        tagContent.id = 'moving-text'
        tagContent.classList.add("moving-text")
        var textContent = document.createTextNode(lastTextContent);
        tagContent.appendChild(textContent)
        div.appendChild(tagContent)
 
        text = div.querySelectorAll('.moving-text')[1]
        text.style.setProperty('--x', -(percentage/2))
   
      }
    }

    setInterval(moveText, 10)