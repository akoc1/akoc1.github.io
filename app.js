const reposContainer = document.getElementById("repos-container");

async function fetchGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/akoc1/repos`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }

    const repos = await response.json();

    const filteredRepos = repos.filter(repo => 
        repo.name !== "akoc1.github.io" &&
        repo.name !== "akoc1"
      );

    displayRepos(filteredRepos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Error loading repositories. Please try again later.";
    reposContainer.appendChild(errorMessage);
  }
}

function displayRepos(repos) {
  reposContainer.innerHTML = "";

  repos.forEach(repo => {
    const repoCard = document.createElement("a");
    repoCard.className = "repo-card";
    repoCard.href = repo.html_url;
    repoCard.target = "_blank";

    const repoTitle = document.createElement("h2");
    repoTitle.textContent = repo.name;

    const repoDescription = document.createElement("p");
    repoDescription.textContent = repo.description || "No description available.";

    const repoStats = document.createElement("div");
    repoStats.className = "repo-stats";

    const stars = document.createElement("span");
    stars.className = "stars";
    stars.textContent = `${repo.stargazers_count}`;

    const forks = document.createElement("span");
    forks.textContent = `🍴 ${repo.forks_count}`;

    repoStats.appendChild(stars);
    repoStats.appendChild(forks);

    repoCard.appendChild(repoTitle);
    repoCard.appendChild(repoDescription);
    repoCard.appendChild(repoStats);

    reposContainer.appendChild(repoCard);
  });
}

fetchGitHubRepos();
