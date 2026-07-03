const username = "YOUR_USERNAME";

const container = document.getElementById("repo-container");

async function loadRepositories() {

    container.innerHTML = "<h2>Načítavam projekty...</h2>";

    try {

        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
            throw new Error("Nepodarilo sa načítať GitHub API.");
        }

        let repos = await response.json();

        // skryje forky
        repos = repos.filter(repo => !repo.fork);

        // zoradí podľa počtu hviezdičiek
        repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

        container.innerHTML = "";

        if (repos.length === 0) {
            container.innerHTML = "<h2>Neboli nájdené žiadne projekty.</h2>";
            return;
        }

        repos.forEach(repo => {

            const card = document.createElement("div");
            card.className = "repo";

            const description =
                repo.description || "Tento projekt zatiaľ nemá popis.";

            const language = repo.language || "Neuvedené";

            const updated = new Date(repo.updated_at);

            card.innerHTML = `

                <h3>${repo.name}</h3>

                <p>${description}</p>

                <div class="repo-info">

                    <span>💻 ${language}</span>

                    <span>⭐ ${repo.stargazers_count}</span>

                </div>

                <div class="repo-info">

                    <span>🕒 ${updated.toLocaleDateString("sk-SK")}</span>

                </div>

                <div class="repo-buttons">

                    <a href="${repo.html_url}" target="_blank">
                        GitHub
                    </a>

                    ${
                        repo.homepage
                            ? `<a href="${repo.homepage}" target="_blank">Live Demo</a>`
                            : ""
                    }

                </div>

            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <h2>
                Nepodarilo sa načítať GitHub projekty.
            </h2>
        `;

    }

}

loadRepositories();