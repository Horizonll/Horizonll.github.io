// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-news",
          title: "news",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/assets/pdf/cv.pdf";
          },
        },{id: "news-tada-thmos-won-the-1st-place-in-the-humanoid-league-of-the-robocup-china-open-2024",
          title: ':tada:THMOS won the 1st place in the humanoid league of the RoboCup China...',
          description: "",
          section: "News",},{id: "news-tada-thmos-reached-the-quarter-finals-in-the-humanoid-league-kid-size-and-5-th-place-in-the-adultsize-league-at-robocup-2024",
          title: ':tada:THMOS reached the quarter-finals in the Humanoid League Kid Size and 5-th place...',
          description: "",
          section: "News",},{id: "news-tada-thmos-won-the-1st-place-in-the-humanoid-league-of-the-robocup-china-open-2025",
          title: ':tada:THMOS won the 1st place in the humanoid league of the RoboCup China...',
          description: "",
          section: "News",},{id: "projects-ai-generated-facial-image-authentication",
          title: 'AI-Generated Facial Image Authentication',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-pillpalpro-a-multifunctional-smart-pill-box",
          title: 'PillPalPro: A Multifunctional Smart Pill Box',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%68%65%72%7A%32%33@%6D%61%69%6C%73.%74%73%69%6E%67%68%75%61.%65%64%75.%63%6E", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Horizonll", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
