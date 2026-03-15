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
    return "#EF4444";
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
    const allIssue= document.getElementById("issueNum")
    allIssue.innerText=`${issues.length} issue`
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

loadIssues();