<template>
  <div class="page">
    <div v-if="pageReady">
      <nav class="site-nav">
        <ul>
          <li v-if="authenticated"><button type="button" class="muted" @click="invokeSave"><img src="./assets/images/cloud.svg" :class="saving ? 'muted' : ''" alt="Autosave" aria-label="Autosaving" /></button></li>
          <li><button type="button" :class="authenticated ? '' : 'muted'" @click="modal = 'account'"><img src="./assets/images/account.svg" alt="Account" aria-label="Your Account" /></button></li>
          <li><button class="muted" type="button" @click="modal = 'about'" target="_blank"><img src="./assets/images/dots.svg" alt="More" aria-label="About this site"></button></li>
        </ul>
      </nav>
      <main class="container">
        <input type="text" class="task-title" v-model="currentTask.title" placeholder="Name your task" />
        <div style="display: flex; margin: 20px 0; align-center: center; gap: 10px">
          <img v-if="!lightningMode" src="./assets/images/time.svg" alt="" />
          <img v-else src="./assets/images/lightning-mode.svg" alt="Lightning mode" />
          <v-select :disabled="working" v-model="currentTask.length" style="width: 50%; border: 0" :options="timeOptions"></v-select>
        </div>
        <editor @ready="loadEditor = true" ref="editor" :config="config" />
      </main>
      <footer class="controls">
        <ul class="folders">
          <li><button style="display: inline-flex; align-items: center; gap: 4px;" @click="foldersOpen = !foldersOpen" class="folders-select" type="button"><img src="./assets/images/folder.svg" alt="Folder" /> {{currentFolder.name}}</button>
            <div v-if="foldersOpen" class="folders-list">
              <draggable group="folders" :list="folders">
                <div style="border-bottom: #ddd solid 1px; margin-bottom: 5px; padding-bottom: 5px; display: flex; align-items: flex-start; justify-content: space-between" v-for="folder in folders" :key="folder.id">
                  <button style="text-align: left" class="change-folder" type="button" @click="changeFolder(folder)" :aria-label="'Change to '+folder.name+' folder'">{{folder.name}}</button>
                  <div style="display: flex; gap: 5px;">
                    <button class="muted" type="button" :aria-label="'Rename '+folder.name" @click="modal = 'renameFolder'; selectedFolder = folder">
                      <img src="./assets/images/pencil.svg" />
                    </button>
                    <button v-if="justCopied === folder.id" class="muted" @blur="justCopied = false" type="button" :aria-label="'Copy '+folder.name" @click="changeFolder(folder)">
                      <img src="./assets/images/arrow.svg" />
                    </button>
                    <button v-else class="muted" @blur="justCopied = false" type="button" :aria-label="'Copy '+folder.name" @click="copyFolder(folder)">
                      <img src="./assets/images/copy.svg" alt="Copy" />
                    </button>
                    <button v-if="folders.length > 1 && currentFolder.id !== folder.id" class="muted" type="button" :aria-label="'Delete '+folder.name" @click="modal = 'deleteFolder'; selectedFolder = folder"><img src="./assets/images/trash.svg" alt="Trash" /></button>
                  </div>
                </div>
              </draggable>
              <form @submit.prevent="addNewFolder" class="add-new-folder">
                <input style="width: 100%" v-model="newFolderName" type="text" placeholder="New folder name" />
                <button class="invisible" ref="addNewFolderButton" :class="newFolderName.trim() === '' ? 'muted' : ''" :disabled="newFolderName.trim() === ''" type="submit"  aria-label="Create new folder"><img src="./assets/images/plus.svg" alt="Add" /></button>
              </form>
            </div>
          </li>
        </ul>
        <div class="action">
          <div class="tooltip">
            <button type="button" :class="lightningMode ? '' : 'muted'" @click="lightningMode = !lightningMode">
              <img src="./assets/images/lightning.svg" alt="Lightning Mode" aria-label="Halves the remaining time" />
            </button>
            <span class="tooltiptext">Lightning</span>
          </div>
          <div class="tooltip">
            <button @click="shuffle = !shuffle" type="button" :class="shuffle ? '' : 'muted'"><img src="./assets/images/shuffle.svg" alt="Shuffle" aria-label="Shuffle tasks" /></button>
            <span class="tooltiptext">Shuffle</span>
          </div>
          <div class="browse">
            <div class="muted tooltip">
              <button @click="startOver()" type="button"><img src="./assets/images/startover.svg" alt="Start over" aria-label="Start over" /></button>
              <span class="tooltiptext">Start over</span>
            </div>
            <div>
              <button v-if="working" type="button" @click="pause()"><img src="./assets/images/pause.svg" alt="Pause" aria-label="Pause task" /></button>
              <button v-else type="button"  @click="play()"><img src="./assets/images/play.svg" alt="Start" aria-label="Start task" /></button>
            </div>
            <div class="muted tooltip">
              <button @click="skip(false)" type="button"><img src="./assets/images/skip.svg" alt="Skip" aria-label="Go to next task" /></button>
              <span class="tooltiptext">Next task</span>
            </div>
          </div>
          <div class="tooltip">
            <button v-if="autoplay" @click="autoplay = !autoplay" type="button"><img src="./assets/images/autoplay.svg" alt="Autoplay" aria-label="Start next task automatically" /></button>
            <button v-else @click="autoplay = !autoplay" type="button" class="muted"><img src="./assets/images/autoplay-off.svg" alt="Autoplay" aria-label="Don’t next task automatically" /></button>
            <span class="tooltiptext">Autoplay</span>
          </div>
            <ul class="folders">
              <li><button @click="queueOpen = !queueOpen" type="button"><img src="./assets/images/queue.svg" alt="List" /></button>
              <div class="queue-list" v-if="queueOpen">
                <div>
                  <div v-if="shuffle">
                    <div style="border-bottom: #ddd 1px solid; margin-bottom: 5px; display: flex; align-items: center; justify-content: space-between" v-for="shuffleTask in shuffledTasks" :key="'shuffle-'+shuffleTask.id">
                      <span @click="changeTask(shuffleTask.id)" :style="shuffleTask.completed ? {fontSize: '15px', padding: '5px 3px', textDecoration: 'line-through', opacity: .5} : {fontSize: '15px', padding: '5px 3px'}">{{shuffleTask.title}}</span>
                      <button v-if="tasks.length > 1 && currentTask.id !== shuffleTask.id" class="muted" style="font-size: 1.25rem" type="button" @click="modal = 'deleteTask'; selectedTask = shuffleTask" aria-label="Delete task"><img src="./assets/images/trash.svg" alt="Delete" /></button>
                    </div>
                  </div>
                  <draggable v-else :list="tasks" group="tasks-todo">
                    <div style="border-bottom: #ddd 1px solid; margin-bottom: 5px; display: flex; align-items: center; justify-content: space-between" v-for="task in tasks" :key="task.id">
                      <span @click="changeTask(task.id)" :style="task.completed ? {fontSize: '15px', padding: '5px 3px', textDecoration: 'line-through', opacity: .5} : {fontSize: '15px', padding: '5px 3px'}">{{task.title}}</span>
                      <button v-if="tasks.length > 1 && currentTask.id !== task.id" class="muted" style="font-size: 1.25rem" type="button" @click="modal = 'deleteTask'; selectedTask = task" aria-label="Delete task"><img src="./assets/images/trash.svg" alt="Delete" /></button>
                    </div>
                  </draggable>
                </div>
                <div>
                  <form @submit.prevent="addNewTask" class="add-new-task">
                    <input style="width: 100%" required v-model="newTaskTitle" type="text" placeholder="New task" />
                    <button :class="newTaskTitle.trim() === '' ? 'invisible muted' : 'invisible'" :disabled="newTaskTitle.trim() === ''" type="submit" aria-label="Create new task"><img src="./assets/images/plus.svg" alt="Add" /></button>
                  </form>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="mark-complete">
          <button @click="skip(true)" v-if="currentTask.completed" type="button"><img src="./assets/images/checkmark-done.svg" alt="Yay!" aria-label="All done!" /></button>
          <button v-else @click="skip(true)" class="muted" type="button"><img src="./assets/images/mark-complete.svg" alt="Mark Complete" aria-label="All done!" /></button>
        </div>
      </footer>
      <div @click="goToNextColor()" style="width: 30px" class="color" :style="{ backgroundColor: activeColor }"></div>
      <div @click="goToNextColor()" class="progress-bar">
        <div @click="goToNextColor()" class="progress-bar-color" :style="{width: progressBarWidth, backgroundColor: activeColor, transitionDuration: transitionDuration, maxWidth: progressBarMaxWidth}"></div>
      </div>
      <div @click="modal = false; waitingForSignin = false" class="overlay" v-if="modal"></div>
      <div class="modal" v-if="modal === 'account'">
        <button @click="modal = false; waitingForSignin = false" type="button" class="close-button">&times;</button>
        <div v-if="authenticated">
          <h2>Your account</h2>
          <p>Email: {{email}}</p>
          <p style="padding-bottom: 10px; display: flex; gap: 10px"><button @click="modal = false" type="submit">OK</button><button @click="logout" type="button">Log out</button></p>
        </div>
        <div v-else>
          <h2>Your account</h2>
          <p>Log into your existing account or create a new one if none exists.</p>
          <p style="font-size: 16px">Wondering why you should register? Access your tasks and preferences across devices.</p>
          <form @submit.prevent="sendEmailSignIn">
            <p><label>Email
              <input :disabled="waitingForSignin" v-model="email" type="email" required />
            </label></p>
            <p style="padding-bottom: 10px"><button :disabled="!email" :class="waitingForSignin || !email ? 'muted' : ''" type="submit">{{waitingForSignin ? 'Check your email' : 'Register / login'}}</button><br><span style="display: block; margin-top: 10px; font-size: 16px">An instant sign-in link will be emailed to you.</span></p>
          </form>
        </div>
      </div>
      <div class="modal" v-if="modal === 'premium'">
        <button @click="modal = false" type="button" class="close-button">&times;</button>
        <div v-if="premium">
          <h2>You’re premium!</h2>
          <ul class="features">
            <li>Cloneable folders</li>
            <li>Task archives</li>
            <li>Zapier integration</li>
          </ul>
          <p>Want to cancel or manage your subscription?</p>
          <form @submit.prevent="goPremium(false); modal = false">
            <p style="padding-bottom: 10px; font-size: 15px;"><button type="submit">Go to manage</button></p>
          </form>
        </div>
        <div v-else>
          <h2>Go premium</h2>
          <p>Knock out your todo lists for just $5 USD monthly.</p>
          <ul class="features">
            <li>Cloneable tasks</li>
            <li>Task archives</li>
            <li>Zapier integration</li>
          </ul>
          <form @submit.prevent="goPremium(); modal = false">
            <p style="padding-bottom: 10px; line-height: 2; font-size: 15px;"><button type="submit">Subscribe</button><br>You can cancel anytime!</p>
          </form>
        </div>
      </div>
      <div class="modal" v-if="modal === 'restart'">
        <button @click="modal = false" type="button" class="close-button">&times;</button>
        <h2>Start task over?</h2>
        <p>This will bring the task to the top of the queue.</p>
        <form>
          <p style="padding-bottom: 10px; line-height: 2; font-size: 15px; display: inline-flex; gap: 10px"><button type="submit">Yes</button> <button type="button" @click="modal = false">No</button></p>
        </form>
      </div>
      <div class="modal" v-if="modal === 'deleteFolder'">
        <button @click="modal = false" type="button" class="close-button">&times;</button>
        <h2>Delete {{selectedFolder.name}}?</h2>
        <p>This is irreversible!</p>
        <form>
          <p style="padding-bottom: 10px; line-height: 2; font-size: 15px; display: inline-flex; gap: 10px"><button type="button" class="submit" @click="modal = false">Never mind</button><button type="button" class="invisible" @click="deleteFolder(selectedFolder.id); modal = false">Delete</button></p>
        </form>
      </div>
      <div class="modal" v-if="modal === 'deleteTask'">
        <button @click="modal = false" type="button" class="close-button">&times;</button>
        <h2>Delete: {selectedTask.name}}?</h2>
        <p>This is irreversible! Notes will be gone.</p>
        <p style="padding-bottom: 10px; line-height: 2; font-size: 15px; display: inline-flex; gap: 10px"><button type="button" class="submit" @click="modal = false">Never mind</button><button type="button" class="invisible" @click="deleteTask(selectedTask.id); modal = false">Delete</button></p>
      </div>
      <div class="modal" v-if="modal === 'renameFolder'">
        <button @click="modal = false" type="button" class="close-button">&times;</button>
        <h2>Rename <code>{{selectedFolder.name}}</code></h2>
        <form @submit.prevent="renameFolder(selectedFolder); modal = false">
          <p><label>New name<br>
            <input v-model="renameFolderName" style="font: inherit" type="text" class="show" required />
          </label></p>
          <p style="padding-bottom: 10px; line-height: 2; font-size: 15px; display: inline-flex; gap: 10px"><button type="submit">Ready</button><button type="button" class="" @click="modal = false">Never mind</button></p>
        </form>
      </div>
      <div class="modal" v-if="modal === 'moreTime'">
        <button @click="modal = false" type="button" class="close-button">&times;</button>
        <h2>Do you want to add another {{currentTask.length.label}}?</h2>
        <p style="padding-bottom: 10px; line-height: 2; font-size: 15px; display: inline-flex; gap: 10px"><button class="submit" @click="startOver(); modal = false" type="button">Yes</button><button type="button" class="" @click="modal = false">No</button></p>
      </div>
      <div class="modal" v-if="modal === 'about'" style="font-size: 18px">
        <button @click="modal = false" type="button" class="close-button">&times;</button>
        <h2>Hey, I’m Amí ✌🏼</h2>
        <p>I’m a <a href="https://naeily.com" target="_blank">freelance web designer and developer</a> based in New Mexico. I built Focusmix with Vue.js, Firebase, and Editor.js.</p>
        <p>Focusmix is in <strong>ALPHA</strong>: Do not use for anything important for now. <a href="https://subscribepage.io/BNo1VG" target="_blank">Sign up for email updates</a>.</p>
        <p>Need support? Email <a href="mailto:ami@naeily.com">ami@naeily.com</a>.</p>
        <form>
          <p style="padding-bottom: 10px; line-height: 2; font-size: 15px; display: inline-flex; gap: 10px"><button @click="modal = false" type="submit">OK</button></p>
        </form>
      </div>
    </div>
    <div v-else class="loading">Loading your experience...</div>
  </div>
</template>

<script>
import Header from '@editorjs/header';
import List from '@editorjs/list';
import CodeTool from '@editorjs/code'
import Paragraph from '@editorjs/paragraph'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Checklist from '@editorjs/checklist'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code';
import draggable from "vuedraggable";
import {firebase, db, auth} from './db'
import { v4 as uuidv4 } from 'uuid';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Times from './assets/json/times.json'

export default {
  name: 'App',
  components: { draggable, vSelect },
  data() {
    return {
      timeLeft: 3600,
      loadEditor: false,
      pageReady: false,
      activeColor: '#f2f2f2',
      progressBarWidth: '0px',
      progressBarMaxWidth: 'none',
      colors: [
        '#ffe8fa',
        '#fdd2d1',
        '#fff2ce',
        '#ebf4e1',
        '#eaf9ff',
        '#f4edff',
        '#f2f2f2'
      ],
      timer: null,
      timeOptions: Times,
      tasks: [],
      shuffledTasks: [],
      note: 'ZxIYZkuMfbS41IAHHDck',
      folders: [],
      justCopied: false,
      config: {
        data: {
          blocks: []
        },
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 3,
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          code: {
            class: CodeTool
          },
          paragraph: {
            class: Paragraph,
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                imgur: true,
                twitter: true
              }
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          checklist: {
            class: Checklist,
          },
          Marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+M',
          },
          delimiter: Delimiter,
        }
      },
      modal: false,
      clear: false,
      newFolderName: '',
      newTaskTitle: '',
      authenticated: false,
      premium: false,
      lightningMode: false,
      shuffle: false,
      autoplay: false,
      working: false,
      foldersOpen: false,
      queue: [],
      queueOpen: false,
      modal: false,
      selectedFolder: null,
      selectedTask: null,
      email: '',
      waitingForSignin: false,
      uid: '',
      saving: false,
      currentTask: {title: '', length: {label: '1 hour', value: 3600}},
      currentFolder: {id: ''},
      renameFolderName: '',
      transitionDuration: 3600
    }
  },
  mounted() {
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.activeColor = randomColor
    var getQueryVariable = (variable) => {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
      }
      return(false);
    }
    auth.onAuthStateChanged((user) => {
      if (user) { //todo flip
        this.uid = user.uid
        this.pullData();
        db.collection('Users').doc(this.uid).get().then((doc) => {
          if (user.email && doc.exists) {
            this.premium = doc.data().premium
          }
        });

        if (user.email) {
          this.email = user.email
          this.authenticated = true
        } else {
          if (getQueryVariable('mode') !== 'signIn') return;
          auth.fetchSignInMethodsForEmail(localStorage.getItem('emailForSignIn')).then((methods) => {
            if (methods.length == 0) {
              if (localStorage.getItem('emailForSignIn') && getQueryVariable('mode') === 'signIn') {
                const credential = firebase.auth.EmailAuthProvider.credentialWithLink(localStorage.getItem('emailForSignIn'), window.location.href)
                user.linkWithCredential(credential).then(() => {
                  this.email = localStorage.getItem('emailForSignIn')
                  this.authenticated = true
                  localStorage.I('emailForSignIn')
                })
              }
            } else {
              if (auth.isSignInWithEmailLink(window.location.href)) {
                const email = localStorage.getItem('emailForSignIn')
                if (!email) {
                  email = window.prompt('Please provide your email for confirmation')
                }

                if (email) {
                  auth.signInWithEmailLink(email, window.location.href)
                  .then(() => {
                    this.modal = 'account';
                    localStorage.removeItem('emailForSignIn');
                    window.history.pushState({}, document.title, window.location.pathname);
                  });
                } else {
                  alert('no email')
                }
              }
            }
          })
        }
      } else {
        auth.signInAnonymously()
        .then(() => {
          this.uid = auth.currentUser.uid
          this.createWelcome();
        })
      }
    });
    window.setInterval(() => {
      this.invokeSave()
    }, 7777)
  },
  watch: {
    currentTask: {
      handler(val){
        this.transitionDuration = this.currentTask.length.value-this.currentTask.elapsed+'s, 100ms, 100ms'
      },
      deep: true
    },
    shuffle(enabled) {
      if (enabled) {
        this.shuffledTasks = this.shuffleTasks()
      }
    },
    pageReady(newValue) {
      if (newValue) {
        if (this.currentTask.elapsed) {
          this.progressBarWidth = 'calc('+this.currentTask.elapsed/this.currentTask.length.value*100+'vw - 30px)'
        } else {
          this.progressBarWidth = 0;
        }
        this.transitionDuration = this.currentTask.length.value-this.currentTask.elapsed+'s, 100ms, 100ms'
        setTimeout(() => {
          this.$refs.editor._data.state.editor.render(this.currentTask.notes)
        }, 888)
      }
    }
  },
  created() {
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  },
  methods: {
    goToNextColor() {
      const currentIndex = this.colors.indexOf(this.activeColor)
      const nextIndex = currentIndex + 1
      if (nextIndex >= this.colors.length) {
        this.activeColor = this.colors[0]
      } else {
        this.activeColor = this.colors[nextIndex]
      }
      this.invokeSave()
    },
    renameFolder(folder) {
      db.collection('Users').doc(this.uid).collection('Folders').doc(folder.id).get().then(() => {
        var selectedFolderIndex = this.folders.indexOf(this.folders.find(element => element.id === folder.id))
        var original = this.folders
        var newFolders = [].concat(original);

        newFolders[selectedFolderIndex] = {
          name: this.renameFolderName,
          id: folder.id
        }

        if (this.currentFolder.id === newFolders[selectedFolderIndex].id) {
          this.currentFolder.name = this.renameFolderName
        }

        db.collection('Users').doc(this.uid).collection('Folders').doc(folder.id).set({
        name: this.renameFolderName
        }, { merge: true }).then(() => {
          this.renameFolderName = ''
        })
        db.collection('Users').doc(this.uid).get().then((doc) => {
          db.collection('Users').doc(this.uid).set({
            folders: newFolders,
            workingFolder: this.currentFolder
          }, { merge: true }).then(() => {
            this.saving = false;
          })
        })
        this.folders = newFolders
      });
    },
    deleteFolder(folder) {
      db.collection('Users').doc(this.uid).collection('Folders').doc(folder).delete().then(() => {
        var selectedFolderIndex = this.folders.indexOf(this.folders.find(element => element.id === folder))
        var original = this.folders
        var newFolders = [].concat(original);
        newFolders.splice(selectedFolderIndex, 1)
        this.folders = newFolders
        db.collection('Users').doc(this.uid).get().then((doc) => {
          db.collection('Users').doc(this.uid).set({
            folders: newFolders,
          }, { merge: true })
        })
      });
    },
    deleteTask(task) {
      db.collection('Users').doc(this.uid).collection('Tasks').doc(task.id).delete().then(() => {
        var selectedTaskIndex = this.tasks.indexOf(this.tasks.find(element => element.id === task.id))
        var original = this.tasks
        var newTasks = [].concat(original);
        newTasks.splice(selectedTaskIndex, 1)
        this.tasks = newTasks
        db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).delete().then(() => {
          db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).set({
            tasks: newTasks
          }, { merge: true }).then(() => {
            this.saving = false;
          })
        });
      });
    },
    beforeWindowUnload(e) {
      this.invokeSave()
    },
    copyFolder(oldFolder) {
      var newFolderName = oldFolder.name + ' (copy)';
      this.newFolderName = newFolderName
      var newFolder = this.addNewFolder();
      this.justCopied = newFolder.id;

      db.collection('Users').doc(this.uid).collection('Folders').doc(oldFolder.id).get().then((doc) => { 
        var newTask = {}
        var tasks = doc.data().tasks;
        if (tasks.length) {
          var newTasks = []
          for (var i = 0; i < doc.data().tasks.length; i++) {
            tasks[i] = doc.data().tasks[i]
            this.newTaskTitle = tasks[i].title
            newTask = this.addNewTask()
            newTask.completed = false
            newTasks.push(newTask)
          }
          db.collection('Users').doc(this.uid).collection('Folders').doc(newFolder.id).set({
            name: newFolderName,
            tasks: newTasks
          })
        }
      })
    },
    changeTask(taskId) {
      this.working = false
      return db.collection('Users').doc(this.uid).collection('Tasks').doc(taskId).get().then((doc) => { 
        this.currentTask = doc.data()
        this.$refs.editor._data.state.editor.render(doc.data().notes)

        db.collection('Users').doc(this.uid).get((doc) => {
          db.collection('Users').doc(this.uid).set({
            workingTask: this.currentTask.id
            }, { merge: true })
        })
      })
    },
    changeFolder(folder) {
      this.currentFolder = folder
      db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).get().then((doc) => { 
        if (doc.data().tasks) {
          this.tasks = doc.data().tasks
          db.collection('Users').doc(this.uid).collection('Tasks').doc(doc.data().tasks[0].id).get().then((doc) => { 
            this.currentTask = doc.data()
            this.$refs.editor._data.state.editor.render(doc.data().notes)
          })
        } else {
          var newTaskId = uuidv4();
          var newTask = {title: 'New task', id: newTaskId, elapsed: 0, length: {label: '1 hour', value: 3600}, completed: false, notes: {blocks: [], version: "2.12.4"}};
          this.tasks = [newTask]

          db.collection('Users').doc(this.uid).collection('Tasks').doc(newTaskId).get().then((doc) => { 
              db.collection('Users').doc(this.uid).collection('Tasks').doc(newTaskId).set(newTask)
          })
        }
      })
    },
    createWelcome() {
      let pageReady = new Promise((resolve, reject) => {
        db.collection('Users').doc(this.uid).get().then((doc) => {
          db.collection('Users').doc(this.uid).set({
            options: {
              lightningMode: this.lightningMode,
              shuffle: this.shuffle,
              autoplay: this.autoplay,
              color: this.activeColor
            },
            premium: false
          }, {merge: true})
        })

        this.newFolderName = 'Welcome to Focusmix';
        this.currentFolder = this.addNewFolder();
        this.newTaskTitle = 'Check it out'
        this.currentTask = this.addNewTask(true);

        db.collection('Users').doc(this.uid).get().then(doc => {
          db.collection('Users').doc(this.uid).set({
            workingTask: this.currentTask.id,
            workingFolder: this.currentFolder
          }, {merge: true}).then(() => {
            db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).get().then((doc) => { 
              db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).set({
                tasks: this.tasks,
              }, { merge: true }).then(() => {
                resolve(true)
              }).catch(() => reject(false))
            }).catch(() => reject(false))
          })
        }).catch(() => reject(false))
      })
      pageReady.then(() => {this.pageReady = true; }).catch(() => {this.pageReady = false})
    },
    startOver() {
      this.animation = 'none'
      this.transitionDuration = this.currentTask.length.value+'s, 100ms, 100ms'
      var originalWorking = this.working
      this.working = false
      clearInterval(this.timer);
      this.currentTask.elapsed = 0
      setTimeout(() => {
        this.animation = null
      }, 666)
      if (originalWorking) {
        this.play()
      } else {
        this.pause()
      }
    },
    pullData() {
      let pageReady = new Promise((resolve, reject) => {
        db.collection('Users').doc(this.uid).get().then(doc => {
          this.premium = false
          this.lightningMode = doc.data().options.lightningMode
          this.shuffle = doc.data().options.shuffle
          this.autoplay = doc.data().options.autoplay
          this.currentFolder = doc.data().workingFolder
          this.activeColor = doc.data().options.color
          return doc;
        }).then((doc) => {
          db.collection('Users').doc(this.uid).collection('Tasks').doc(doc.data().workingTask).get().then(doc => {
            if (doc.exists) {
              this.currentTask = doc.data()
            }
          }).then(() => {
            db.collection('Users').doc(this.uid).get().then((doc) => {
              this.folders = doc.data().folders
            }).then(() => {
              if (this.currentFolder) {
                db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).get().then(doc => {
                  var orderedTasks = doc.data().tasks;
                  if (doc.exists) {
                    this.tasks = orderedTasks
                    resolve(true)
                  }
                }).catch(() => reject(false))
              }
            }).catch(() => reject(false))
          }).catch(() => reject(false))
        }).catch(() => reject(false))
      })
      pageReady.then(() => {this.pageReady = true }).catch(() => {this.pageReady = false})
    },
    shuffleTasks() {
      var original = this.tasks
      var copy = [].concat(original);
      for (let i = copy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy
    },
    getNextArrItem(startIndex, arr) {
      var nextIndex = startIndex + 1
      if (nextIndex >= arr.length) {
        nextIndex = false
      }
      return arr[nextIndex]
    },
    skip(completed = false) {
      var tasks = this.tasks
      if (this.shuffle) {
        tasks = this.shuffledTasks
      }
      var thisTask = tasks.indexOf(tasks.find(element => element.id === this.currentTask.id))
      var nextTask = this.getNextArrItem(thisTask, tasks)

      if (nextTask) {
        if (completed) {
          this.currentTask.elapsed = this.currentTask.length.value
          this.currentTask.completed = true
        }
        this.changeTask(nextTask.id)
        if (this.autoplay) {
          this.play()
        }
      } else {
        this.newTaskTitle = 'New task'
        var newCurrentTask = this.addNewTask()
        if (completed) {
          this.currentTask.elapsed = this.currentTask.length.value
          this.currentTask.completed = true
          var currentTaskIndex = this.tasks.indexOf(this.tasks.find(element => element.id === this.currentTask.id))

          var original = this.tasks
          var copy = [].concat(original);
          copy[currentTaskIndex].completed = true;
          this.tasks = copy
        }
        this.changeTask(newCurrentTask.id)
        if (this.autoplay) {
          this.play()
        }
      }
    },
    invokeSave() {
      this.saving = true;
      this.$refs.editor._data.state.editor.save()
      .then((data) => {
        db.collection('Users').doc(this.uid).collection('Tasks').doc(this.currentTask.id).get().then((doc) => {
          var taskLength = this.currentTask.length
          if (!taskLength) {
            taskLength = { label: '1 hour', value: 3600 }
          }
          db.collection('Users').doc(this.uid).collection('Tasks').doc(this.currentTask.id).set({
            notes: data,
            title: this.currentTask.title,
            length: taskLength,
            elapsed: this.currentTask.elapsed|0,
            completed: this.currentTask.complete|false
          }, {merge: true}).then(() => {
            this.saving = false;
          })
        })
      })

      db.collection('Users').doc(this.uid).get().then((doc) => {
        db.collection('Users').doc(this.uid).set({
          options: {
            lightningMode: this.lightningMode,
            shuffle: this.shuffle,
            autoplay: this.autoplay,
            color: this.activeColor,
          },
          workingFolder: this.currentFolder,
          workingTask: this.currentTask.id
        }, {merge: true}).then(() => {
          this.saving = false;
        })
      })

      db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).get().then((doc) => { 
        db.collection('Users').doc(this.uid).collection('Folders').doc(this.currentFolder.id).set({
          tasks: this.tasks,
        }, { merge: true }).then(() => {
          this.saving = false;
        })
      })
    },
    goPremium(start = true) {
      this.premium = !this.premium;
      db.collection('Users').doc(this.uid).get().then((doc) => {
        db.collection('Users').doc(this.uid).set({
          premium: !start
        }, { merge: true })
      })
    },
    logout() {
      auth.signOut().then(() => {
        window.location.href = '/'
      });
    },
    sendEmailSignIn() {
      auth.sendSignInLinkToEmail(this.email, {
        url: 'https://focusmix.website',
        handleCodeInApp: true
      })
      .then(() => {
        localStorage.setItem('emailForSignIn', this.email);
      });
      this.waitingForSignin = true;
    },
    addNewTask(seed = false) {
      this.saving = true;
      var newTaskId = uuidv4();
      var newTask = {title: this.newTaskTitle, id: newTaskId, elapsed: 0, length: {label: '1 minute', value: 60}, completed: false, notes: {blocks: [], version: "2.12.4"}};
      if (seed) {
        newTask.notes.blocks = [
          {
            data: {
              text: 'Hi, Focusmix is a tool for getting stuff done.'
            },
            id: "moTtRFW4VL",
            type: "paragraph"
          },
          {
            data: {text: '▶️ Hit the play button.'},
            id: "xGAIubcQNS",
            type: "paragraph"
          },
          {
            data: {text: 'As you can see, the page is a progress bar. (Click the color bar the left side to change to your favorite.)'},
            id: "HcSf6A18HS",
            type: "paragraph"
          },
          {
            data: {text: 'Create folders on the left side and organize tasks on the right side.'},
            id: "l8gu-1k-6S",
            type: "paragraph"
          },
          {
            data: {text: 'This area you’re reading is for your notes.'},
            id: "l8gu-1k-6S",
            type: "paragraph"
          },
          {
            data: {text: 'Other features include lightning mode ⚡️ (halves the remaining time), shuffle, and autoplay.'},
            id: "seYBLpHl2W",
            type: "paragraph"
          },
          {
            data: {text: 'Enjoy!'},
            id: "sQWPzD4NOz",
            type: "paragraph"
          }
        ]
      } else {
        newTask.notes.blocks = [{type: 'paragraph', data: { text: 'These are notes. Click to edit them.'}}]
      }
      this.tasks.push({title: this.newTaskTitle, id: newTaskId, completed: false})
      this.shuffledTasks.push({title: this.newTaskTitle, id: newTaskId, completed: false})

      db.collection('Users').doc(this.uid).collection('Tasks').doc(newTaskId).get().then((doc) => {
        db.collection('Users').doc(this.uid).collection('Tasks').doc(newTaskId).set({
          id: newTaskId,
          title: this.newTaskTitle,
          length: { value: 3600, label: '1 hour'},
          notes: newTask.notes,
          elapsed: 0,
          completed: false
        }).then(() => {
          this.saving = false;
          this.newTaskTitle = '';
        })
      })
      return newTask;
    },
    addNewFolder() {
      this.saving = true;
      var newFolderId = uuidv4();
      var newFolder = {name: this.newFolderName, id: newFolderId}
      this.folders.push(newFolder)

      db.collection('Users').doc(this.uid).get().then((doc) => {
        db.collection('Users').doc(this.uid).set({
          folders: this.folders,
        }, { merge: true }).then(() => {
          this.saving = false;
        })
        this.saving = true;
        db.collection('Users').doc(this.uid).collection('Folders').doc(newFolderId).get().then((doc) => {
          db.collection('Users').doc(this.uid).collection('Folders').doc(newFolderId).set({
            name: this.newFolderName,
          }, { merge: true }).then(() => {
            this.newFolderName = '';
          })
        })
      })
      return newFolder;
    },
    play() {
      this.progressBarWidth = 'calc(100vw - 30px)'
      this.working = true
      this.timer = setInterval(() => {
        this.currentTask.elapsed = this.currentTask.elapsed+1/10;
        if (this.currentTask.elapsed >= this.currentTask.length.value) {
          if (this.autoplay) {
            this.skip(true)
          } else {
            this.modal = 'moreTime'
          }
          clearInterval(this.timer);
        }
        this.progressBarMaxWidth = this.currentTask.elapsed/this.currentTask.length.value*100+'%'
      }, 1000/10)
    },
    pause() {
      this.working = false
      this.progressBarWidth = 'calc('+this.currentTask.elapsed/this.currentTask.length.value*100+'vw - 30px)'
      clearInterval(this.timer)
      this.invokeSave()
    }
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
  .controls {
    width: 800px;
  }
}
@media (min-width: 1024px) {
  .container, .controls {
    margin: 0 auto;
  }
}
.container {
  position: relative;
  z-index: 50;
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
  padding: 0 10px 0 30px;
  background: rgba(255,255,255,.95);
  z-index: 100;
  display: grid;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
}
@media (min-width: 0px) and (max-width: 1023px) {
  .controls {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
@media (min-width: 1024px) {
  .controls {
    border-radius: 100px;
    bottom: 20px;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
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
.folders {
  display: flex;
  align-items: center;
  list-style: none;
  padding-left: 0;
  position: relative;
}
.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .action {
    grid-row-start: 1;
    grid-column-start: 1;
    grid-row-end: 1;
    grid-column-end: 3;
  }
}
.browse {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
@media (min-width: 0px) and (max-width: 1023px) {
  .browse {
    grid-row-start: 1;
    grid-column-start: 2;
    grid-row-end: 1;
    grid-column-end: 2;
  }
}
@media (min-width: 0px) and (max-width: 1023px) {
  .mark-complete {
    margin-top: -10px;
    position: relative;
    left: 10px;
  }
}
@media (min-width: 1024px) {
  .mark-complete {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.color, .progress-bar, .progress-bar-color {
  width: 0;
  position: fixed;
  height: 100vh;
  top: 0;
  z-index: 0;
}
.progress-bar {
  left: 30px;
}
.progress-bar-color {
  left: 30px;
  transition-property: width, background, maxWidth;
  transition-timing-function: ease-in-out;
  transition-duration: 100ms, 100ms, 100ms;
}
.color {
  left: 0;
  min-width: 30px;
  z-index: 3;
}
.site-nav {
  z-index: 60;
  text-align: right;
  display: inline-block;
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
  transition: opacity 100ms;
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
  bottom: 60px;
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
    right: 10px;
    bottom: 120px;
  }
}
@media (min-width: 1024px) {
  .queue-list {
    bottom: 60px;
    right: 150px;
  }
}
.change-folder {
  font-size: 17px;
}
.add-new-folder, .add-new-task {
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
@media (min-width: 0px) and (max-width: 1023px) {
  .add-new-task {
    bottom: 120px;
    width: 290px;
  }
}
@media (min-width: 1024px) {
  .add-new-task {
    bottom: 60px;
    width: 290px;
  }
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
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0);
  z-index: 101;
  cursor: wait;
}
.modal {
  background: #fff;
  width: 355px;
  padding: 0 30px;
  margin: 0 auto;
  z-index: 102;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  background: url(./assets/images/star.svg) no-repeat center left;
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
</style>
