function createTopbar() {
  const topbar = document.getElementById("topbar");
  topbar.className = "topbar";

  const logo = document.createElement("div");
  logo.textContent = "Robotics Team";

  const nav = document.createElement("nav");
  ["Home", "About", "Our Events", "Archive", "Social", "More"].forEach(tab => {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = tab;
    nav.appendChild(link);
  });

  topbar.appendChild(logo);
  topbar.appendChild(nav);
}

function createHeader() {
  const header = document.getElementById("main-header");
  const h1 = document.createElement("h1");
  h1.textContent = "Welcome to Our Robotics Team";
  header.appendChild(h1);

  const teamImages = document.createElement("div");
  teamImages.className = "team-images";
  ["https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150"].forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    teamImages.appendChild(img);
  });

  header.appendChild(teamImages);
}

function createSection1() {
  const section = document.getElementById("section1");
  section.className = "section";
  section.innerHTML = `
    <h2>What We Do</h2>
    <p>Our robotics team is dedicated to innovation, teamwork, and problem-solving. 
    We design, build, and program robots to compete in exciting competitions.</p>
    <div class="events">
      <a href="https://www.bestrobotics.org" target="_blank">BEST Robotics</a>
      <a href="https://www.firstinspires.org/robotics/frc" target="_blank">FRC Robotics</a>
    </div>
  `;
}

function createSection2() {
  const section = document.getElementById("section2");
  section.className = "section";
  section.innerHTML = `
    <h2>Watch Our Team in Action</h2>
    <div style="text-align:center;">
      <iframe width="560" height="315" 
        src="https://www.youtube.com/embed/VIDEO_ID" 
        frameborder="0" allowfullscreen></iframe>
    </div>
  `;
}

function createFooter() {
  const footer = document.getElementById("main-footer");
  footer.innerHTML = `
    <p>
      Robot Wranglers<br>
      Legacy Ranch HS<br>
      450 County Road 258 | Liberty Hill, TX 78642<br>
      Phone: (512) 379-3290<br>
      Lead Mentor: <a href="mailto:" style="color:white;">Email</a> | <a href="tel:" style="color:white;">Phone</a>
    </p>
    <p>&copy; 2025 Robot Wranglers</p>
  `;
}

// Initialize page
createTopbar();
createHeader();
createSection1();
createSection2();
createFooter();

