<template>
  <user-nav />
  <main-content />
  <controls-nav />
  <modal-content />
</template>

<script>
import UserNav from '@/components/UserNav'
import MainContent from '@/components/MainContent'
import ControlsNav from '@/components/ControlsNav'
import ModalContent from '@/components/ModalPopups'

export default {
  components: {
    UserNav,
    MainContent,
    ControlsNav,
    ModalContent
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;600&display=swap');
* {
  max-width: 100%;
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  font: 21px/1.5 "Assistant", Helvetica, Arial, sans-serif;
  overflow-x: hidden;
}
#app {
  height: 100vh;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .container, .controls {
    width: 100%;
    padding: 20px;
  }
}
@media (min-width: 1024px) {
  .container {
    width: 650px;
  }
}
@media (min-width: 1024px) {
  .container, .controls {
    margin: 0 auto;
  }
}
.container {
  position: relative;
  z-index: 10;
}
.codex-editor__redactor {
  height: calc(100% - 100px);
  overflow: scroll;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .container {
    padding-top: 10px;
  }
}
@media (min-width: 1024px) {
  .container {
    padding-top: 80px;
  }
}
.controls {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 10px 10px 30px;
  background: rgba(255,255,255,.95);
  z-index: 100;
  display: grid;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
}
@media (min-width: 0px) and (max-width: 1023px) {
  .controls {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    align-items: center;
    padding: 10px 10px;
  }
}
@media (min-width: 1024px) {
  .controls {
    border-radius: 100px;
    bottom: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
button {
  cursor: pointer;
}
input[type="text"]:not(.show), select, textarea, button[type="button"], button[type="submit"].invisible {
  font-family: inherit;
  background: 0;
  padding: 0;
  margin: 0;
  border: 0;
  display: block;
  border-radius: 4px;
  color: #000;
}
button[type="button"] {
  font-size: 15px;
}
input[type="text"]:focus,input[type="text"]:focus:not(.show), select:focus, textarea:focus, button[type="button"]:focus, button[type="submit"].invisible:focus {
  background-color: rgba(0,0,0,.06);
  outline: none;
}
.task-title {
  font-size: 2.5rem;
  font-weight: 600;
  width: 100%;
}
.task-time {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 20px;
  padding-left: 38px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.folders-select {
  font-size: 1rem;
}
.task-details {
  font-size: 1rem;
}
.queue {
  display: flex;
  align-items: center;
  list-style: none;
  padding-left: 0;
  position: relative;
}
.action {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
}
@media (max-width: 1023px) {
  .action {
    justify-content: center;
  }
}
.play-pause {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .mark-complete {
    position: relative;
    left: 10px;
  }
  .mark-complete img {
    width: 50px;
  }
}
@media (min-width: 1024px) {
  .mark-complete {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.site-nav button {
  position: relative;
  z-index: 60;
}
.mark-complete {
  flex: 1;
}
.color, .progress-bar, .progress-bar-color {
  position: fixed;
  height: 100vh;
  top: 0;
  z-index: -2;
}
.progress-bar {
  left: 30px;
}
.progress-bar-color {
  transition-property: width, background;
  transition-timing-function: linear;
  transition-duration: 60s, 1ms;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 30px;
  width: 0;
  max-width: calc(100vw - 30px)
}
.color {
  left: 0;
  min-width: 30px;
  z-index: -1;
}
.site-nav {
  z-index: 60;
  text-align: right;
  display: inline-block;
  position: relative;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .site-nav {
    position: relative;
    float: right;
  }
}
@media (min-width: 1024px) {
  .site-nav {
    position: fixed;
    top: 0;
    right: 0;
  }
}
.site-nav ul {
  list-style: none;
  margin: 10px 10px 0 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.muted {
  opacity: .5;
  transition: opacity 1ms;
}
.muted:hover {
  opacity: .75;
}
.ce-block__content {
  max-width: none;
  width: 100%;
}
.folders-list, .queue-list {
  position: fixed;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  width: 320px;
  border-radius: 4px;
  padding: 10px 20px 100px;
  height: 320px;
  overflow: scroll;
}
.folders-list {
  bottom: 0px;
  left: 10px;
}
.folders-list ul,  .queue-list ul {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
  padding-bottom: 100px;
}
.folders-list li,  .queue-list li {
  padding: 10px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .queue-list {
    left: 0;
    bottom: 0;
  }
}
@media (min-width: 1024px) {
  .queue-list {
    bottom: 0;
    left: 0;
  }
}
.change-folder {
  font-size: 17px;
}
.add-new-folder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  padding: 5px 0;
  background: #fff;
}
.add-new-folder {
  bottom: 60px;
  width: 290px;
}
.add-new-task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-right: 10px;
}
.tooltip {
  position: relative;
  display: block;
}
.tooltiptext {
  display: none;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  min-width: 80px !important;
  position: absolute;
  z-index: 1;
  font-size: 14px;
}
.tooltip:hover .tooltiptext {
  display: block;
}
.tooltiptext {
  width: 120px;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.tooltiptext {
  width: 120px;
  bottom: -100%;
  left: 50%;
  transform: translateX(-50%);
}
a {
  color: #000;
  text-decoration-thickness: 1px;
}
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(222, 222, 222, .5);
  z-index: 101;
  display: grid;
  place-items: center;
}
.screen {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(222, 222, 222, 0);
  z-index: 99;
  display: grid;
  place-items: center;
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0);
  z-index: 101;
  cursor: wait;
  text-align: center;
  width: 100%;
}
.modal {
  background: #fff;
  width: 355px;
  padding: 0 30px;
  margin: 0 auto;
  z-index: 102;
  border-radius: 4px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: left;
}
button.close-button {
  font-size: 3rem;
  position: absolute;
  top: 10px;
  right: 30px;
}
label {
  font-size: 16px;
  font-weight: 600;
}
input[type="email"], input[type="password"] {
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
}
button[type="submit"]:not(.invisible),button[type="button"].submit {
  border: 0;
  background: #444;
  color: #fff;
  padding: 5px;
  font-size: 17px;
  font-weight: 600;
}
.features {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}
.features li {
  padding-left: 40px;
  background: url(@/assets/images/star.svg) no-repeat center left;
}
.saving {
  opacity: .25;
}
.vs__dropdown-toggle, .vs__search {
  border: 0;
  font: inherit;
  background: 0 !important;
}
.vs__actions {
  background: 0 !important;
  display: none;
}
.not-allowed {
  cursor: not-allowed;
}
.cdx-checklist__item-checkbox {
  margin-top: 13px;
}
.cdx-checklist__item-checkbox::after {
  top: 5px;
  left: 4px;
  width: 8px;
  height: 4px;
}
code, .ce-code__textarea {
  background: #eaf9ff !important;
  color: inherit !important;
  font-family: monospace !important;
  border: 0;
  font-size: 16.5px !important;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .queue-login {
    display: none;
  }
}
.task-list-item {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.task-list-item:not(:last-child) {
  border-bottom: #ddd 1px solid;
}
.queue-modal {
  padding-bottom: 40px;
}
.task-list {
  max-height: 240px;
  overflow: auto;
  padding-right: 10px;
}
@media (max-width: 600px) {
  .ce-popover {
    bottom: 82px !important
  }
}
</style>
