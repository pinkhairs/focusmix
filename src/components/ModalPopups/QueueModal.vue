<template>
    <div @click="store.modal = false" class="overlay" v-if="store.modal"></div>
    <div class="queue-modal modal" v-if="store.modal === 'queue'" style="font-size: 18px">
        <button @click="store.modal = false" type="button" class="close-button">&times;</button>
        <h2>Queue</h2>
        <form @submit.prevent="addNewTask(newTaskTitle); newTaskTitle = ''" class="add-new-task">
            <input style="width: 100%" required v-model="newTaskTitle" type="text" placeholder="Add a new task..." />
            <button :class="newTaskTitle.trim() === '' ? 'invisible muted' : 'invisible'" :disabled="newTaskTitle.trim() === ''" type="submit" aria-label="Create new task">
                <img src="@/assets/images/plus.svg" alt="Add" />
            </button>
        </form>
        <div class="task-list">
            <div class="task-list-item" v-for="task in tasks" :key="task.id">
                <span @click="changeTask(task.id); store.modal = false" :style="task.complete ? {fontSize: '15px', padding: '5px 3px', textDecoration: 'line-through', opacity: .5} : {fontSize: '15px', padding: '5px 3px'}">{{task.title}}</span>
                <button v-if="tasks.length > 1 && store.currentTaskId !== task.id" class="muted" style="font-size: 1.25rem" type="button" @click="deleteTask(task.id)" aria-label="Delete task">
                    <img src="@/assets/images/trash.svg" alt="Delete" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from '@/stores'

export default {
    data() {
        return {
            newTaskTitle: ''
        }
    },
    setup() {
        const store = useStore()
        const tasks = computed(() => JSON.parse(store.getAllTasks))
        const addNewTask = (newTaskTitle) => {
            store.addNewTask(newTaskTitle)
        }
        const changeTask = (newTaskId) => {
            store.changeTask(newTaskId)
        }
        const deleteTask = (deleteTaskId) => {
            if (confirm('Are you sure?')) {
                store.deleteTask(deleteTaskId)
            }
        }
        return { store, tasks, addNewTask, changeTask, deleteTask }
    }
}

</script>