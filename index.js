const domElement = {
  jobContainer: document.querySelector('#jobs'),
}
// get all jobs data
const getJobs = async () => await (await fetch('./data.json')).json()

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
            <p class="time">${job.postedAt}</p>
            <span class="type">${job.contract}</span>
            <span class="location">${job.location}</span>
          </div>
        </div>
      </div>
      <div class="filters">
       <div class="filter">${job.role}</div>
      ${job.tools.map(tool => `<div class="filter">${tool}</div>`)}
      ${job.languages.map(lang => `<div class="filter">${lang}</div>`)}
      </div>
    </div>`
    }
    domElement.jobContainer.innerHTML = cardTemplate
  })
}

createJobCard()
