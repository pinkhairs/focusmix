<template>
  <user-nav />
  <main-content />
  <controls-nav />
  <modal-content v-if="store.modal" />
</template>

<script>
import UserNav from '@/components/UserNav'
import MainContent from '@/components/MainContent'
import ControlsNav from '@/components/ControlsNav'
import ModalContent from '@/components/ModalPopups'
import { useStore } from '@/stores'

export default {
  components: {
    UserNav,
    MainContent,
    ControlsNav,
    ModalContent
  },
  setup() {
    const store = useStore()
    return { store }
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
.codex-editor__redactor {
  height: calc(100% - 100px);
  overflow: scroll;
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
a {
  color: #000;
  text-decoration-thickness: 1px;
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
.queue-modal {
  padding-bottom: 40px;
}
@media (max-width: 600px) {
  .ce-popover {
    bottom: 82px !important
  }
}
</style>
