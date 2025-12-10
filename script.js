// let url = "https://api.github.com/users";

// window
//   .fetch(url)
//   .then((res) => res.json())
//   .then((userData) => {
//     userData.map((person) => {
//       let sub_container = document.createElement("div");
//       let image_container = document.createElement("div");
//       let user_container = document.createElement("h3");
//       let name = document.createElement("h2");
//       let login = document.createElement("h2");
//       let type = document.createElement("h2");
//       let images = document.createElement("img");

//       name.innerText = `UserId :${person.id}`;
//       login.innerText = `Name : ${person.login}`;
//       type.innerText = `Type : ${person.type}`;
//       user_container.appendChild(name);
//       user_container.appendChild(login);
//       user_container.appendChild(type);
//       let main_container = document.getElementById("container");
//       main_container.appendChild(sub_container);
//       sub_container.appendChild(image_container);
//       sub_container.appendChild(user_container);
      
//       image_container.appendChild(images);
//       images.src = `${person.avatar_url}`;
//       images.style.height = "250px";
//       images.style.width = "250px";
//       images.style.borderRadius = "50px";
//       sub_container.style.backgroundColor = "gray";
//       sub_container.style.margin = "10px";
//       sub_container.style.borderRadius = "10px 30px";
//       sub_container.style.display="flex"
//       sub_container.style.alignItems="center"
//       sub_container.style.justifyContent="space-evenly"
//       console.log(sub_container);


//     });
//   })
//   .catch((err) => console.log(err));

let url = "https://api.github.com/users";

window
  .fetch(url)
  .then((res) => res.json())
  .then((userData) => {
    userData.forEach((person) => {
      // card wrapper (row)
      let sub_container = document.createElement("div");
      sub_container.style.display = "flex";
      sub_container.style.flexDirection = "row";
      sub_container.style.alignItems = "center";
      sub_container.style.justifyContent = "flex-start";
      sub_container.style.gap = "16px";
      sub_container.style.backgroundColor = "#f2f2f2";
      sub_container.style.padding = "12px";
      sub_container.style.margin = "10px";
      sub_container.style.borderRadius = "10px";
      sub_container.style.maxWidth = "900px";

      // image (left)
      let image_container = document.createElement("div");
      let images = document.createElement("img");
      images.src = person.avatar_url;
      images.style.width = "120px";
      images.style.height = "120px";
      images.style.borderRadius = "50%";
      images.style.objectFit = "cover";
      image_container.appendChild(images);

      // right side: info stacked, button under info
      let right_container = document.createElement("div");
      right_container.style.display = "flex";
      right_container.style.flexDirection = "column";
      right_container.style.justifyContent = "center";
      right_container.style.alignItems = "flex-start";
      right_container.style.flex = "1";

      // info elements
      let idElem = document.createElement("div");
      idElem.textContent = `User ID: ${person.id}`;
      idElem.style.fontWeight = "600";
      idElem.style.marginBottom = "6px";

      let nameElem = document.createElement("div");
      nameElem.textContent = `Name: ${person.login}`;
      nameElem.style.marginBottom = "6px";

      let typeElem = document.createElement("div");
      typeElem.textContent = `Type: ${person.type}`;

      // button container to center button horizontally under info
      let button_container = document.createElement("div");
      button_container.style.width = "100%";
      button_container.style.display = "flex";
      button_container.style.justifyContent = "center";
      button_container.style.marginTop = "10px";

      let button = document.createElement("button");
      button.innerText = "View Details";
      button.style.padding = "8px 14px";
      button.style.backgroundColor = "#007bff";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.borderRadius = "6px";
      button.style.cursor = "pointer";

      button_container.appendChild(button);

      right_container.appendChild(idElem);
      right_container.appendChild(nameElem);
      right_container.appendChild(typeElem);
      right_container.appendChild(button_container);

      // append to main container
      sub_container.appendChild(image_container);
      sub_container.appendChild(right_container);
      document.getElementById("container").appendChild(sub_container);

      // button click -> open modal with full details
      button.addEventListener("click", () => {
        fetch(person.url)
          .then((res) => res.json())
          .then((fullUserData) => {
            openModal(fullUserData);
          })
          .catch((err) => console.log(err));
      });
    });
  })
  .catch((err) => console.log(err));

// Modal Function
function openModal(fullUserData) {
  let modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "999";

  let modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "white";
  modalContent.style.padding = "24px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.width = "80%";
  modalContent.style.maxWidth = "600px";
  modalContent.style.maxHeight = "80vh";
  modalContent.style.overflowY = "auto";
  modalContent.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";

  let closeBtn = document.createElement("button");
  closeBtn.innerText = "✕";
  closeBtn.style.float = "right";
  closeBtn.style.backgroundColor = "#ff4444";
  closeBtn.style.color = "white";
  closeBtn.style.border = "none";
  closeBtn.style.borderRadius = "50%";
  closeBtn.style.width = "30px";
  closeBtn.style.height = "30px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "16px";

  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  // details markup
  modalContent.innerHTML = `
    <h2 style="margin-top:0;">${fullUserData.login}</h2>
    <div style="display:flex;gap:18px;align-items:center;margin-bottom:12px;">
      <img src="${fullUserData.avatar_url}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;">
      <div>
        <p style="margin:4px 0;"><strong>User ID:</strong> ${fullUserData.id}</p>
        <p style="margin:4px 0;"><strong>Node ID:</strong> ${fullUserData.node_id || "N/A"}</p>
        <p style="margin:4px 0;"><strong>Type:</strong> ${fullUserData.type}</p>
        <p style="margin:4px 0;"><strong>Site Admin:</strong> ${fullUserData.site_admin === true ? "Yes" : (fullUserData.site_admin === false ? "No" : "N/A")}</p>
        <p style="margin:4px 0;"><strong>User View Type:</strong> ${fullUserData.user_view_type || "N/A"}</p>
      </div>
    </div>

    <div style="margin-bottom:10px;">
      <p style="margin:4px 0;"><strong>Login:</strong> ${fullUserData.login}</p>
      <p style="margin:4px 0;"><strong>Name:</strong> ${fullUserData.name || "N/A"}</p>
      <p style="margin:4px 0;"><strong>Gravatar ID:</strong> ${fullUserData.gravatar_id || "N/A"}</p>
      <p style="margin:4px 0;"><strong>HTML URL:</strong> ${fullUserData.html_url ? `<a href="${fullUserData.html_url}" target="_blank">${fullUserData.html_url}</a>` : "N/A"}</p>
      <p style="margin:4px 0;"><strong>API URL:</strong> ${fullUserData.url ? `<a href="${fullUserData.url}" target="_blank">${fullUserData.url}</a>` : "N/A"}</p>
    </div>

    <div style="margin-bottom:10px;">
        <div style="margin-bottom:10px;">
      <p style="margin:4px 0;"><strong>Followers URL:</strong> <a href="${fullUserData.followers_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Followers</a></p>
      <p style="margin:4px 0;"><strong>Following URL:</strong> <a href="${fullUserData.following_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Following</a></p>
      <p style="margin:4px 0;"><strong>Gists URL:</strong> <a href="${fullUserData.gists_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Gists</a></p>
      <p style="margin:4px 0;"><strong>Starred URL:</strong> <a href="${fullUserData.starred_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Starred</a></p>
      <p style="margin:4px 0;"><strong>Subscriptions URL:</strong> <a href="${fullUserData.subscriptions_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Subscriptions</a></p>
      <p style="margin:4px 0;"><strong>Organizations URL:</strong> <a href="${fullUserData.organizations_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Organizations</a></p>
      <p style="margin:4px 0;"><strong>Repos URL:</strong> <a href="${fullUserData.repos_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Repositories</a></p>
      <p style="margin:4px 0;"><strong>Events URL:</strong> <a href="${fullUserData.events_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Events</a></p>
      <p style="margin:4px 0;"><strong>Received Events URL:</strong> <a href="${fullUserData.received_events_url}" target="_blank" style="color:#007bff;text-decoration:none;">View Received Events</a></p>
    </div>

    <div style="margin-bottom:10px;">
      <p style="margin:4px 0;"><strong>Bio:</strong> ${fullUserData.bio || "N/A"}</p>
      <p style="margin:4px 0;"><strong>Company:</strong> ${fullUserData.company || "N/A"}</p>
      <p style="margin:4px 0;"><strong>Location:</strong> ${fullUserData.location || "N/A"}</p>
      <p style="margin:4px 0;"><strong>Email:</strong> ${fullUserData.email || "N/A"}</p>
      <p style="margin:4px 0;"><strong>Blog:</strong> ${fullUserData.blog || "N/A"}</p>
      <p style="margin:4px 0;"><strong>Twitter:</strong> ${fullUserData.twitter_username || "N/A"}</p>
    </div>

    <div style="margin-bottom:10px;">
      <p style="margin:4px 0;"><strong>Public Repos:</strong> ${fullUserData.public_repos ?? "N/A"}</p>
      <p style="margin:4px 0;"><strong>Public Gists:</strong> ${fullUserData.public_gists ?? "N/A"}</p>
      <p style="margin:4px 0;"><strong>Followers:</strong> ${fullUserData.followers ?? "N/A"}</p>
      <p style="margin:4px 0;"><strong>Following:</strong> ${fullUserData.following ?? "N/A"}</p>
    </div>

    <div style="margin-bottom:10px;">
      <p style="margin:4px 0;"><strong>Created At:</strong> ${fullUserData.created_at ? new Date(fullUserData.created_at).toLocaleString() : "N/A"}</p>
      <p style="margin:4px 0;"><strong>Updated At:</strong> ${fullUserData.updated_at ? new Date(fullUserData.updated_at).toLocaleString() : "N/A"}</p>
    </div>
  `;

  modalContent.insertBefore(closeBtn, modalContent.firstChild);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}