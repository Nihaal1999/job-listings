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
    for (let job of jobs) {
      if (filterState.length) {
        const filterCondition = checkFilterCondition(job)
        if (!filterCondition) continue
      }
      cardTemplate += `<div class="job ${job.featured ? 'leftBorder' : ''}">
      <div class="leftFlex">
        <img src=${job.logo} alt=${job.company + ' image'} class="jobImage" />
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
      <div class="lineDiv"></div>
      <div class="filters">
      ${createFilters({
        role: job.role,
        tools: job.tools,
        languages: job.languages,
      })}
      </div>
    </div>`
    }
    jobContainer.innerHTML = cardTemplate
  })
}

const createFilters = ({role, tools, languages}) => {
  return `<div class="filter" onclick="handleAddFilter(this,'role')">${role}</div>
  ${tools
    .map(
      tool =>
        `<div class="filter" onclick="handleAddFilter(this,'tool')">${tool}</div>`,
    )
    .join('')}
  ${languages
    .map(
      lang =>
        `<div class="filter" onclick="handleAddFilter(this,'lang')">${lang}</div>`,
    )
    .join('')}
  </div>`
}

createJobCard()

//local storage
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
  <div class="selectedFilter">${filter.value}</div>
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

// event handlers
const handleAddFilter = (e, type) => {
  const state = {
    value: e.textContent,
    type,
  }
  if (!filterState.some(obj => obj.value === e.textContent)) {
    filterState.push(state)
  }
  createSelectedFilters()
  createJobCard()
  updateLocalStorage()
}

const handleRemoveFilter = (e, shouldRemoveAll) => {
  if (shouldRemoveAll) {
    filterState.splice(0, filterState.length)
  } else {
    filterState.splice(
      filterState.findIndex(el => el.value === e.textContent),
      1,
    )
  }
  createSelectedFilters()
  createJobCard()
  updateLocalStorage()
}

const checkFilterCondition = job => {
  let filterKind = '' // * role+ || role+lang+ || role+lang+tool+ || lang+tool+ || lang+ || tool+

  filterState.forEach(state => {
    if (state.type === 'role') {
      if (!filterKind.includes('role')) filterKind += 'role+'
    }
    if (state.type === 'tool') {
      if (!filterKind.includes('tool')) filterKind += 'tool+'
    }
    if (state.type === 'lang') {
      if (!filterKind.includes('lang')) filterKind += 'lang+'
    }
  })

  let filterCondition = null

  switch (filterKind) {
    case 'role+':
      filterCondition = hasRoleFn(job)
      break
    case 'lang+':
      filterCondition = hasLangFn(job, filterKind)
      break
    case 'tool+':
      filterCondition = hasToolFn(job, filterKind)
      break
    case 'role+lang+' || 'lang+role+':
      filterCondition = hasRoleFn(job) && hasLangFn(job, filterKind)
      break
    case 'role+tool+' || 'tool+role+':
      filterCondition = hasRoleFn(job) && hasToolFn(job, filterKind)
      break
    case 'tool+lang+' || 'lang+tool+':
      filterCondition = hasToolFn(job, filterKind) && hasLangFn(job, filterKind)
      break
    case 'role+lang+tool+' ||
      'lang+role+tool+' ||
      'lang+tool+role+' ||
      'role+tool+lang+' ||
      'tool+lang+role+' ||
      'tool+role+lang+':
      filterCondition =
        hasRoleFn(job) &&
        hasLangFn(job, filterKind) &&
        hasToolFn(job, filterKind)
      break
  }

  return filterCondition
}

const hasLangFn = job =>
  filterState.every(el =>
    el.type !== 'lang' ? true : job.languages.includes(el.value),
  )

const hasToolFn = job =>
  filterState.every(el =>
    el.type !== 'tool' ? true : job.tools.includes(el.value),
  )
const hasRoleFn = job => filterState.some(el => el.value === job.role)
