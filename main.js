let activeStatus = "all";
const statusTabs = document.querySelectorAll(".status-btn");
statusTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeStatus = tab.value;

    toggleStatus(tab);
    loadIssues(activeStatus);
    setCounter(activeStatus);
  });
});

const priorityColor = (priority) => {
  if (priority === "high") return "bg-[#FEECEC] text-[#EF4444]";
  if (priority === "medium") return "bg-[#FFF6D1] text-[#F59E0B]";
  if (priority == "low") return "bg-[#EEEFF2] text-[#9CA3AF]";
};

const labelStyles = {
  bug: "bg-red-100 text-red-500 border-red-300",
  "help wanted": "bg-orange-100 text-orange-500 border-orange-300",
  enhancement: "bg-green-100 text-green-500 border-green-300",
  "good first issue": "bg-purple-100 text-purple-500 border-purple-300",
  documentation: "bg-blue-100 text-blue-500 border-blue-300",
};

const setCounter = (status) =>{
    const counter = document.getElementById("issueNum");

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res=> res.json())
    .then(data => {
        const issues = data.data;
        if(status === 'all'){
            counter.innerText = `${issues.length} issues`;
            return;
        }
        else{
            const filteredIssues = issues.filter(issue => issue.status === status);
            counter.innerText = `${filteredIssues.length} issues`;
            return;
        }

    })
};

const displayLabel = (labels) => {
  if (!labels || labels.length === 0) return "";

  return labels
    .map((label) => {
      const key = label.toLowerCase();
      const style = labelStyles[key] || "bg-gray-100 text-gray-500 border-gray-300";
      const formatted = key.replaceAll(" ", "-");

      return `
      <div class="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${style}">
        <img class="w-3 h-3" src="assets/${formatted}.png">
        <span>${label.toUpperCase()}</span>
      </div>
      `;
    })
    .join("");
};

const borderColor = (status) => {
  if (status === "open") {
    return "#22C55E";
  } 
  else if (status === "closed") {
    return "#A855F7";
  }
};
//function to toggle status styles based on clicking button
const toggleStatus = (clickedTab) => {
  statusTabs.forEach((tab) => {
    tab.classList.remove("btn-primary");
  });
  clickedTab.classList.add("btn-primary");
};

const loadIssues=()=>
{
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues"
    fetch(url)                  
    .then((res) => res.json())  
    .then((data) =>             
      displayAllIssues(data.data));
}

const displayAllIssues=(issues)=>
{
    const issuesContainer = document.getElementById("cardContainer")
    issuesContainer.innerHTML=""
    issues.forEach((issue) => {
    const card = document.createElement("div");
    card.innerHTML=`
    
      <div onclick="loadDetails(${issue.id})"
class="h-full flex flex-col justify-between rounded-lg bg-white shadow-sm border-t-4 border-t-[${borderColor(issue.status)}] transition duration-200 hover:shadow-md hover:-translate-y-1">

    <!-- Top Content -->
    <div class="p-4 space-y-3">

        <!-- Status + Priority -->
        <div class="flex justify-between items-center">

            <img class="w-5 h-5" src="./assets/${issue.status}-Status.png">

            <span class="px-4 py-1 rounded-full text-xs font-semibold ${priorityColor(issue.priority)}">
                ${issue.priority.toUpperCase()}
            </span>

        </div>

        <!-- Title + Description -->
        <div class="space-y-1">
            <h3 class="text-sm font-semibold text-gray-800">
                ${issue.title}
            </h3>

            <p class="text-xs text-gray-500 line-clamp-2">
                ${issue.description}
            </p>
        </div>

        <!-- Labels -->
        <div class="flex flex-wrap gap-2">
            ${displayLabel(issue.labels)}
        </div>

    </div>

    <!-- Bottom Section -->
    <div class="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 flex justify-between items-center">

        <div class="flex flex-col">
            <span>#${issue.id} by ${issue.author}</span>
        </div>

        <div>
            ${issue.createdAt}
        </div>

    </div>

</div>
    
    `
    issuesContainer.appendChild(card);

    })
    
}

//function to load issue details by clicking on issue card
const loadDetails = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then(res=> res.json())
    .then(data => displayDetails(data.data));
};

//function to display details with a modal
const displayDetails = (issues) => {
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
        <!-- details card  -->
            <div class="bg-white w-11/12 max-w-[700px] mx-auto rounded-lg p-6 space-y-6">
                <h1 class="text-xl font-bold text-[#1F2937]">${issues.title}</h1>

                <div class="flex gap-3 flex-col md:flex-row justify-center items-center md:justify-start">
                    <span class="px-3 py-2 rounded-full bg-[${borderColor(issues.status)}] text-white text-xs font-medium w-fit">${issues.status.toUpperCase()}</span>
                    <span class="text-[#64748B] text-xs">Opened by ${issues.author}</span>
                    <span class="text-[#64748B] text-xs">${issues.updatedAt}</span>
                </div>

                <div class="flex items-center gap-4">
                    <div class="flex flex-col md:flex-row gap-2"> ${displayLabel(issues.labels)} </div>
                </div>

                <p class="text-base text-[#64748B]">${issues.description}</p>

                <div class="bg-[#F8FAFC] rounded-lg p-6 flex justify-between">
                    <div class="space-y-2">
                        <p class="text-base text-[#64748B]">Assignee:</p>
                        <h3 class="text-base font-semibold text-[#1F2937]">${issues.assignee}</h3>
                    </div>

                    <div class="space-y-2">
                        <p class="text-base text-[#64748B]">Priority</p>
                        <p class="w-fit px-8 py-2 rounded-full text-xs font-medium ${priorityColor(issues.priority)} ${issues.priority}">${issues.priority.toUpperCase()}</p>
                    </div>
                </div>
            </div>
    `;
    document.getElementById("issue_details").showModal();
}
document.getElementById("search-btn").addEventListener('click',()=>{
const searchInput = document.getElementById("search-input")
const searchValue = searchInput.value.trim().toLowerCase()
if(searchValue === ''){
        alert('Enter a word to search');
        return;
    }
fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`,
    )
    .then(res=>res.json())
    .then(data => displayAllIssues(data.data));
})
setCounter(activeStatus)
loadIssues();