'use strict';
//Todo------------------ Global variable-----------------------
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal'); //Give a node list
const tabs = document.querySelectorAll('.operations__tab');
const tabsConatiner = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
///////////////////////////////////////
//Todo------------------ Modal window-----------------------
const openModal = function (e) {
  e.preventDefault(); //Prevent to go on top of page
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnOpenModal =>
  btnOpenModal.addEventListener('click', openModal)
);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//TODO ---------Implementing Smooth Scrolling-----------
btnScroll.addEventListener('click', function (e) {
  // const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y) ', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   `height/width viewport`,
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //*Scrolling
  //Old way
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //New way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//ToDo--------Event delegation:Page navigation-------------
//?Old way to set eventhandler to multiple element
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //Preventing from default behaviour
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//?New way to set eventhandler to multiple element-->Event delegation
//1.Add event listener to common parent element
//2.Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy-->Add event only to desirable element
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id !== '#')
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//ToDo----------------Tabbed Component---------------------
// tabs.forEach(el => {
//   el.addEventListener('click', function (e) {
//     console.log(`altaf`);
//   });
// });

tabsConatiner.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return; //Guard clause-->function get return if condition match and on other code work

  //Remove classes
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//ToDo----------Passing Argument to event handlers----------
//*Fade effect
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
//this keyword in handleHover function bind to 0.5
nav.addEventListener('mouseout', handleHover.bind(1));
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e,0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e,1);
// });
//TODO ------------------Sticky navigation--------------------
// const intialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > intialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//TODO ------------------Intersection observer API--------------------
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.dir(entries);
//   });
// };
// const obsOption = {
//   root: null,
//   threshold: 0.1,
// };
// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1);

//*Sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; //getting nav height

const stickyNav = function (entries) {
  const [entry] = entries; //getting first entry
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const observerHeader = new IntersectionObserver(stickyNav, {
  root: null, //if root element to null means veiwport
  threshold: 0, //if interaction-ratio is 0(header is not intersecting with veiwport) then callback excute
  rootMargin: `-${navHeight}px`,
});

observerHeader.observe(header);

//*Reveal sections
const allSection = document.querySelectorAll('.section');
const revealSections = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return; //if isIntersecting is false then return and no code is excute
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //unobserve increase performance
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//*Lazy loading
const imgTarget = document.querySelectorAll('.features__img');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  //when source of image is changed  a event(load) is attached to element
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

//TODO ------------------Slider Component--------------------
const slider = function () {
  // const slider = document.querySelector('.slider');
  // slider.style.transform = `scale(0.4) translateX(-800px)`;
  // slider.style.overflow = `visible`;

  //Variable
  let curslide = 0;
  const slides = document.querySelectorAll('.slide');
  const maxSlide = slides.length;
  const btnRight = document.querySelector('.slider__btn--right');
  const btnleft = document.querySelector('.slider__btn--left');
  const containerDots = document.querySelector('.dots');
  //Creating dots
  const createDots = function () {
    slides.forEach((_, i) => {
      containerDots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //Show active slide dot
  const activateDot = function (slide) {
    //removing the class
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    //adding class to current-slide dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //Function that changes transform property
  const goToSlide = function (currentslide) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${(i - currentslide) * 100}%)`)
    ); //when translateX(0%) for a slide then that slide is visible
  };

  //Intailising function-->call other function
  const intial = function () {
    createDots(); //creating dots
    activateDot(0); //Intialy active slide-dot
    goToSlide(0); //Adding transform css in each slide
  };
  intial();

  //Next slide
  const nextSlide = function () {
    if (curslide === maxSlide - 1) curslide = 0;
    else {
      curslide++;
    }
    goToSlide(curslide);
    activateDot(curslide);
  };

  //previuos slide
  const previuosSlide = function () {
    if (curslide === 0) curslide = maxSlide - 1;
    else {
      curslide--;
    }
    goToSlide(curslide);
    activateDot(curslide);
  };

  //Click event
  btnRight.addEventListener('click', nextSlide);
  btnleft.addEventListener('click', previuosSlide);

  //KeyBoard event
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previuosSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  //Dots button event
  containerDots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log(e.target.dataset);//return a object
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
//TODO ---------Selecting,Creating and Deleting Element-----------
/*
//?Selecting Html element
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

//Seclecting by query
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section'); //Give a node list which is not get affected if we delete element in dom
console.log(allSection);
//Selecting by tag,class,ID-->Give a Html collection  which is get affected if we delete element in dom
const allButton = document.getElementsByTagName('button');
console.log(allButton);

console.log(document.getElementsByClassName('btn'));
console.log(document.getElementById('section--1'));

//?Creating and inserting element
//1.insertAdjacentHTML
// header.insertAdjacentHTML('beforeend', '<h1>Altaf</h1>');

//2.append,prepend,before,after
//*Adding cookie message
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookie for improved functionality and analytics.<button class ="btn btn--close--cookie">Got it!</button>';
header.append(message);
// header.prepend(message);
// header.append(message.cloneNode(true));

//?Deleting HTML element
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove(); //New method
    // message.parentElement.removeChild(message);//Deleting element using Dom traversing-->Old method
  });
//TODO --------------Styles,Attributes and classes----------------
//?Styles-->Create inline Css
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//?To get External Css
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

//?To change CSS variable(root)
document.documentElement.style.setProperty("--color-primary","crimson");

//?Attributes
const logo  = document.querySelector(".nav__logo");
console.log(logo);
console.log(logo.className);

console.log(logo.getAttribute("src"));//Prefered
console.log(logo.src);

logo.setAttribute("a","b");//To change existing attributes "a" is attribute and "b" is new value

const link = document.querySelector(".nav__link--btn");
console.log(link.href);
console.log(link.getAttribute("href"));//Prefered

//?Data Attributes-->Attributes must start with data and use Camel case 
console.log(logo.dataset.numberVersion);

//?Classes
logo.classList.add("c","d");//Can add multiple classes,"c" and "d" are class name
logo.classList.remove("c","d");//Can remove multiple classes
logo.classList.toggle("c");//if class excist remove it and if class not excist add it
logo.classList.contains("c","d");//if class excist give True and if class not excist give False

// logo.className = "Altaf";//Don't use this
*/
//TODO ---------Type of Event and Event handlers-----------
/*
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('Mouse is Hover');
  h1.removeEventListener('mouseenter', alertH1); //Use this in function if you want event occur only one time
};

h1.addEventListener('mouseenter', alertH1); //New way
// h1.onmouseleave = alertH1; //Old way
//!<h1 onclick="alert('Altaf')">-->OlD wway
*/
//TODO ----------------Event Propagation------------------
/*
const randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Link`, e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`Container`, e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log(`NAV`, e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});
*/
//ToDo-----------------Dom traversing--------------------
/*
const h1 = document.querySelector('h1');

//?Going downwards:Child
console.log(h1.querySelectorAll('.highlight')); //querySelector can also be apply on element
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'white';

//?Going upward : Parents
console.log(h1.parentNode);
console.log(h1.parentElement);

console.log(h1.closest('.header'));
h1.closest('.header').style.background = 'var(--gradient-secondary)';
console.log(h1.closest('h1'));
h1.closest('h1').style.background =
  'linear-gradient(to top left, #ffb003, skyblue)';

//?Going sideWay : siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
//ToDo-----------------Life-Cycle of DOM event--------------------
/*
document.addEventListener('DOMContentLoaded', function (e) {
  console.log(e);
});

window.addEventListener('load', function (e) {
  console.log(e);
}); //to see this event use slow 3G

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = ''; //!use only when you want to give warning to user to not leave this page
});
*/
