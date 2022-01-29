const jobContainer = document.getElementById('jobs')
const selectedFiltersContainer = document.querySelector('.searchBox')
// get all jobs data
const getJobs = async () => await (await fetch('./data.json')).json()

const KEY = '__jl__.'
const FILTER_KEY = KEY + 'filters'

const filterState = JSON.parse(window.localStorage.getItem(FILTER_KEY)) ?? []

// create job card
const createJobCard = () => {
  getJobs().then(jobs => {
    let cardTemplate = ``
    for (job of jobs) {
      if (filterState.length) {
        console.log(
          job,
          filterState,
          'role',
          filterState.includes(job.role),
          'lang',
          filterState.some(el => job.languages.indexOf(el) >= 0),
          'tools',
          filterState.some(el => job.tools.indexOf(el) >= 0),
        )
        const hasRole = filterState.includes(job.role)
        const hasLanguage = filterState.some(
          el => job.languages.indexOf(el) >= 0,
        )
        const hasTool = filterState.some(el => job.tools.indexOf(el) >= 0)
        const filterCondition = hasRole || hasLanguage || hasTool

        console.log(!filterCondition)
        if (!filterCondition) continue
      }
      cardTemplate += `<div class="job ${job.featured ? 'leftBorder' : ''}">
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
  ${tools
    .map(
      tool =>
        `<div class="filter" onclick="handleAddFilter(this)">${tool}</div>`,
    )
    .join('')}
  ${languages
    .map(
      lang =>
        `<div class="filter" onclick="handleAddFilter(this)">${lang}</div>`,
    )
    .join('')}
  </div>`
}

createJobCard()

const handleAddFilter = e => {
  const value = e.textContent
  if (!filterState.includes(value)) {
    filterState.push(value)
  }
  createSelectedFilters()
  createJobCard()
  updateLocalStorage()
}

const updateLocalStorage = () => {
  window.localStorage.setItem(FILTER_KEY, JSON.stringify(filterState))
}

const createSelectedFilters = () => {
  if (!filterState.length) {
    selectedFiltersContainer.classList.add('hide')
  } else {
    selectedFiltersContainer.classList.remove('hide')
  }
  let template = ``
  template += ` <div class="selectedFiltersBox">
  ${filterState
    .map(
      filter => `<div class="selectedFilterWrapper">
  <div class="selectedFilter">${filter}</div>
  <div class="removeIconBox" onclick="handleRemoveFilter(this)">
    <img
      src="./images/icon-remove.svg"
      alt="remove filter"
      class="removeIcon"
      width="14"
      height="14"
    />
  </div>
  </div>`,
    )
    .join('')}
</div>
<button class="clearBtn" onclick="handleRemoveFilter(this,true)">Clear</button>`

  selectedFiltersContainer.innerHTML = template
}

createSelectedFilters()

const handleRemoveFilter = (e, shouldRemoveAll) => {
  if (shouldRemoveAll) {
    filterState.splice(0, filterState.length)
  } else {
    filterState.splice(filterState.indexOf(e.textContent), 1)
  }
  createSelectedFilters()
  createJobCard()
  updateLocalStorage()
}
