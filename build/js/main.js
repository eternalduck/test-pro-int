"use strict";

// March, 2021
document.addEventListener("DOMContentLoaded", function () {
  //================
  // Slider
  // https://splidejs.com/getting-started/
  //================
  new Splide("#coffee-slider", {
    type: "loop",
    pagination: false,
    perPage: 2,
    gap: 30,
    fixedWidth: "560px",
    breakpoints: {
      992: {
        perPage: 1,
        fixedWidth: "auto"
      }
    }
  }).mount();
  new Splide("#combo-slider", {
    type: "loop",
    pagination: false,
    perPage: 3,
    gap: 30,
    fixedWidth: "360px",
    breakpoints: {
      992: {
        perPage: 2,
        fixedWidth: "360px"
      },
      750: {
        perPage: 1,
        fixedWidth: "300px"
      }
    }
  }).mount(); //================
  // Tabs
  //================
  // TODO: needs improvement if we want to add several instances on a page, i.e.
  // let tabsets = document.querySelectorAll("tabset")
  // for ( let i = 0, tabsets.length < i; i++ ) {
  // 	...our processing
  // }

  var tabset = document.getElementById("giftset-tabs");

  if (tabset) {
    var countTabsAndMakeControls = function countTabsAndMakeControls() {
      tabs.forEach(function (tab, i) {
        // assign data-tab for each tab
        tab.dataset.tab = i + 1; // populate controls based on tabs

        var tabNumber = document.createElement("div");
        tabNumber.textContent = i + 1; // assign data-link for each tab

        tabNumber.dataset.link = i + 1;
        tabNumber.classList.add(controlItemClass);
        controlsContainer.appendChild(tabNumber); // make first one active (TODO: this step needs improvement)

        document.querySelector(".tabset__controls-item").classList.add(controlActiveClass);
      }); //forEach

      tabsNavigation();
    }; //countTabsAndMakeControls


    var tabsNavigation = function tabsNavigation() {
      var controlItems = controlsContainer.querySelectorAll(".tabset__controls-item");
      controlItems.forEach(function (control, i) {
        control.addEventListener("click", function () {
          // clear active class from all controls
          controlItems.forEach(function (item) {
            return item.classList.remove(controlActiveClass);
          }); // add active class to the clicked control

          control.classList.add(controlActiveClass); // clear active class from all tabs

          tabs.forEach(function (tab) {
            return tab.classList.remove(tabActiveClass);
          }); // add active class to the corresponding tab

          tabsContainer.querySelector(".tabset__tab[data-tab='".concat(control.dataset.link, "']")).classList.add(tabActiveClass);
        });
      });
    }; //tabsNavigation


    var tabsContainer = document.querySelector(".tabset__tabs");
    var tabs = tabsContainer.querySelectorAll(".tabset__tab");
    var controlsContainer = document.querySelector(".tabset__controls");
    var controlItemClass = "tabset__controls-item";
    var controlActiveClass = "tabset__controls-item_active";
    var tabActiveClass = "tabset__tab_active";
    countTabsAndMakeControls();
  } //if tabset

}); //DOMContentLoaded