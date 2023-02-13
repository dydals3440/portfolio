"use strict";

// Make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
  } else {
    navbar.classList.remove("navbar--dark");
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  //   undefined 처리 (navbar 메뉴가 아닌 곳을 클릭시 undefined)
  const target = event.target;
  const link = target.dataset.link;
  if (link === null) {
    return;
  }
  // mobile 환경에서 navbar 원하는 위치 클릭시 스크롤링 되면서 open이라는 속성을 없앰. 보기 편하게
  navbarMenu.classList.remove("open");
  scrollIntoView(link);
});

// navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("open");
});

// Handle click on "contact me" button on home
const homeContactBtn = document.querySelector(".home__contact");
homeContactBtn.addEventListener("click", () => {
  scrollIntoView("#contact");
});

//  Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector(".home__container");
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button whe scrolling down
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener("scroll", () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add("visible");
  } else {
    arrowUp.classList.remove("visible");
  }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener("click", () => {
  scrollIntoView("#home");
});

// Projects
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
// querySelectorAll을 통해 배열로 모든 프로젝트를 받아옵니다.
const projects = document.querySelectorAll(".project");

workBtnContainer.addEventListener("click", (e) => {
  // dataset.filter값이없으면 parentNode의 dataset.filter 값을 확인하겠다. 즉, 숫자버튼을 눌를떄 span태그이기 때문에 undefined 예외 핸들링
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  // filter가 null이면 아무것도 x
  if (filter == null) {
    return;
  }
  // Remove Selection from the previous item and select the new one
  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");
  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  target.classList.add("selected");
  console.log(e.target.nodeName);
  console.log(e.target);
  console.log(e.target.parentNode);

  projectContainer.classList.add("anim-out");
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });
    projectContainer.classList.remove("anim-out");
  }, 300);
});

// 1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다.
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.
const sectionIds = [
  "#home",
  "#about",
  "#skills",
  "#work",
  "#testimonials",
  "#contact",
];

// 드림코딩 배열편 확인
// 문자열을 갖고 있는 배열을 빙글빙글 돌면서 각각의 id를 section dom요소로 변환하는 새로운 배열을 만듬, 배열을 하나하나 돌면서 새로운 배열을 만드는 것은 map을 활용
const sections = sectionIds.map((id) => document.querySelector(id)); // Array(6) 0: section#home 1:section#about.section.section_container... 등등
const navItems = sectionIds.map(
  (id) => document.querySelector(`[data-link="${id}"]`) //Array(6) li.navbar__menu__item.active, 1: li.navbar__menu__item ;;;
);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}

// 겹치는 부분은 재사용성 위해 함수처리
function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      //entry의 타겟은 빠져나가는 섹션
      const index = sectionIds.indexOf(`#${entry.target.id}`); // [index:1, entry.target.id: 'about']
      // 스크롤링이 아래로 되어서 페이지가 올라옴, 뒤에 딸아오는 인덱스 선택
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});
