const domElement = {
  jobContainer: document.querySelector('.jobs'),
  filterContainer: document.querySelector('.filters'),
}
// get all jobs data
const getJobs = async () => await (await fetch('./data.json')).json()

// create job card
const createJobCard = () => {
  getJobs().then(jobs => {
    for (job of jobs) {
      console.log(job)
    }
  })
}

createJobCard()
