import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useStorage } from '@vueuse/core'

const defaultTaskId = uuidv4()

const success = require('@/assets/media/success.mp3')
const beep = require('@/assets/media/beep.mp3')

const colors = [
  '#ffe8fa',
  '#fdd2d1',
  '#fff2ce',
  '#ebf4e1',
  '#eaf9ff',
  '#f4edff',
  '#f2f2f2'
]

export const useStore = defineStore({
  id: 'store',
  state: () => ({
    currentTaskElapsed: useStorage('currentTaskElapsed', 0),
    currentTaskId: useStorage('currentTaskId', defaultTaskId),
    tasks: useStorage('tasks', JSON.stringify([
      {
        id: defaultTaskId,
        title: 'Check it out',
        time: 30,
        elapsed: 0,
        complete: false,
        content: [
          {
            data: {text: 'Welcome. Focusmix is a tool for getting stuff done.'},
            id: "moTtRFW4VL",
            type: "paragraph"
          },
          {
            data: {text: '▶️ Hit the play button.'},
            id: "xGAIubcQNS",
            type: "paragraph"
          },
          {
            data: {text: 'As you’ll see, the page is a progress bar. (Click the color bar the left side to change to your favorite.)'},
            id: "HcSf6A18HS",
            type: "paragraph"
          },
          {
            data: {text: 'This area you’re reading is for notes while you’re working.'},
            id: "l8gu-1k-6S",
            type: "paragraph"
          },
          {
            data: {text: 'You have access to a task queue and archive.'},
            id: "seYBLpHl2W",
            type: "paragraph"
          },
          {
            data: {text: 'Enjoy!'},
            id: "sQWPzD4NOz",
            type: "paragraph"
          }
        ]
      }
    ])),
    inProgress: false,
    modal: null,
    progressBar: '0px',
    timer: null,
    color: useStorage('color', colors[0])
  }),
  getters: {
    title: (state) => {
      const tasks = JSON.parse(state.tasks)
      return tasks.find((task) => {
        return task.id === state.currentTaskId
      }).title
    },
    content: (state) => {
      const tasks = JSON.parse(state.tasks)
      return tasks.find((task) => {
        return task.id === state.currentTaskId
      }).content
    },
    time: (state) => {
      const tasks = JSON.parse(state.tasks)
      return tasks.find((task) => {
        return task.id === state.currentTaskId
      }).time
    },
    elapsed: (state) => {
      const tasks = JSON.parse(state.tasks)
      return tasks.find((task) => {
        return task.id === state.currentTaskId
      }).elapsed
    },
    getAllTasks: (state) => {
      return state.tasks
    },
    completed: (state) => {
      const tasks = JSON.parse(state.tasks)
      return tasks.find((task) => {
        return task.id === state.currentTaskId
      }).complete
    }
  },
  actions: {
    startTimer() {
      let elapsed = parseInt(localStorage.getItem('currentTaskElapsed')) | 0
      this.currentTaskElapsed = elapsed++
      this.timer = setInterval(() => {
        this.currentTaskElapsed = elapsed++
        if (this.currentTaskElapsed >= this.time) {
          this.modal = 'more-time'
          const audio = new Audio(beep)
          audio.play()
          clearInterval(this.timer)
          this.pause()
        }
      }, 1000)
    },
    play() {
      const progressBarWidth = 'calc(100vw - 30px)'
      this.progressBar = progressBarWidth
      this.inProgress = true
      this.startTimer()
      this.duration = this.time-this.currentTaskElapsed+'s'
    },
    pause() {
      const percentageDone = 100-((this.time-this.currentTaskElapsed)/this.time)*100
      const progressBarWidth = 'calc('+percentageDone+'vw - 30px)'
      this.inProgress = false
      this.progressBar = progressBarWidth
      this.duration = '0s'
      this.elapseTime(this.currentTaskElapsed)
      clearInterval(this.timer)
    },
    updateTitle(newTitle) {
      const tasks = JSON.parse(this.tasks)
      const updatedTasks = tasks.map((task) => {
        if (task.id === this.currentTaskId) {
          task.title = newTitle
        }
        return task
      })
      console.log({tasks})
      this.tasks = JSON.stringify(updatedTasks)
    },
    updateContent(newContent) {
      const tasks = JSON.parse(this.tasks)
      const updatedTasks = tasks.map((task) => {
        if (task.id === this.currentTaskId) {
          task.content = newContent
        }
        return task
      })
      this.tasks = JSON.stringify(updatedTasks)
    },
    updateTime(newTime) {
      this.currentTaskElapsed = 0
      const tasks = JSON.parse(this.tasks)
      this.elapseTime(0)
      const updatedTasks = tasks.map((task) => {
        if (task.id === this.currentTaskId) {
          task.time = newTime
        }
        return task
      })
      this.tasks = JSON.stringify(updatedTasks)
    },
    addNewTask(newTaskTitle) {
      const tasks = JSON.parse(this.tasks)
      tasks.push({
        id: uuidv4(),
        title: newTaskTitle,
        time: 30,
        elapsed: 0,
        complete: false,
        content: [{
          data: {text: 'Type here.'},
          id: "xGAIubcQNS",
          type: "paragraph"
        }]
      })
      this.tasks = JSON.stringify(tasks)
    },
    deleteTask(deleteTaskId) {
      const tasks = JSON.parse(this.tasks)
      this.tasks = JSON.stringify(tasks.filter((task) => {
        return task.id !== deleteTaskId
      }))
    },
    elapseTime(newValue) {
      const tasks = JSON.parse(this.tasks)
      const updatedTasks = tasks.map((task) => {
        if (task.id === this.currentTaskId) {
          task.elapsed = newValue
        }
        return task
      })
      this.tasks = JSON.stringify(updatedTasks)
    },
    goToNextColor() {
      const currentIndex = colors.indexOf(this.color)
      const nextIndex = currentIndex + 1
      if (nextIndex >= colors.length) {
        this.color = colors[0]
      } else {
        this.color = colors[nextIndex]
      }
    },
    startOver() {
      this.currentTaskElapsed = 0
      this.elapseTime(0)
      this.progressBar = 0
    },
    toggleComplete() {
      this.pause()
      const tasks = JSON.parse(this.tasks)
      const updatedTasks = tasks.map((task) => {
        if (task.id === this.currentTaskId) {
          task.complete = !task.complete
          if (task.complete === true) {
            const audio = new Audio(success)
            audio.play()
          }
        }
        return task
      })
      this.tasks = JSON.stringify(updatedTasks)
    },
    changeTask(newTaskId) {
      this.pause()
      this.currentTaskId = newTaskId
      setTimeout(() => {
        this.currentTaskElapsed = this.elapsed
        this.progressBar = 'calc('+this.currentTaskElapsed/this.time*100+'vw - 30px)'
      }, 0)
    },
  }
})