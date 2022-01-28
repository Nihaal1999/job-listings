const jobContainer = document.getElementById('jobs')
// get all jobs data
const getJobs = async () => await (await fetch('./data.json')).json()

const KEY = '__jl__.'
const FILTER_KEY = KEY + 'filters'

const filterState = JSON.parse(window.localStorage.getItem(FILTER_KEY)) ?? []

console.log(filterState)

// create job card
const createJobCard = () => {
  getJobs().then(jobs => {
    let cardTemplate = ``
    for (job of jobs) {
      cardTemplate += `<div class="job">
      <div class="leftFlex">
        <img src=${job.logo} alt="job" class="jobImage" />
        <div class="info">
          <div class="companyBox">
            <h4 class="companyName">${job.company}</h4>
            ${job.new ? '<span class="newTag">new!</span>' : ''}
            ${job.featured ? '<span class="featuredTag">featured</span>' : ''}
          </div>
          <h3 class="title">${job.position}</h3>
          <div class="detailsBox">
            <div class="time">${job.postedAt}</div>
            <div>•</div>
            <div class="type">${job.contract}</div>
            <div>•</div>
            <div class="location">${job.location}</div>
          </div>
        </div>
      </div>
      <div class="filters">
      ${createFilters({
        role: job.role,
        tools: job.tools,
        languages: job.languages,
      })}
      </div>
    </div>`
    }
    // console.log(cardTemplate)
    jobContainer.innerHTML = cardTemplate
  })
}

const createFilters = ({role, tools, languages}) => {
  return `<div class="filter" onclick="handleAddFilter(this)">${role}</div>
  ${tools.map(tool => `<div class="filter">${tool}</div>`).join('')}
  ${languages.map(lang => `<div class="filter">${lang}</div>`).join('')}
  </div>`
}

createJobCard()

// const filters = document.querySelectorAll('.filter')
// console.log(filters)

// filters.forEach(filter => {
//   filter.addEventListener('click', function () {
//     console.log({filter})
//   })
// })

function handleAddFilter(e) {
  const value = e.textContent
  if (!filterState.includes(value)) {
    filterState.push(value)
  }
  console.log(filterState)
  window.localStorage.setItem(FILTER_KEY, JSON.stringify(filterState))
}
