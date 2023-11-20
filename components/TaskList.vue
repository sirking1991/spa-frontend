<style>
.task-action-buttons{
  text-align: end;
}
</style>
<template>
    <div class="container w-50 mt-5">
        <div class="row">
            <div class="col-9">
                <h3>Tasks</h3>                
            </div>
            <div class="col-3"  align-v="end">
                <button class="btn btn-primary btn-sm"
                  v-on:click="showTaskFormComponent('taskForm0')"
                >Add task</button>
                <button class="btn btn-danger btn-sm" v-on:click="logout">Logout</button>
            </div>
        </div>

        <TaskForm :formId="'taskForm0'" />

        <b-list-group>
          <b-list-group-item button 
            v-for="(task, index) in tasks" :key="task.id"            
            >
            <span v-if="task.completed" style="text-decoration: line-through;">{{ task.title}}</span>
            <span v-if="!task.completed">{{ task.title}}</span>
            
            <p class="text-muted" style="font-style: italic;">
              <small>
                {{ task.description }}
                <p>Due on {{ formattedDueOn(task.due_on) }}</p>
              </small>
            </p>
            <p class="task-action-buttons" >
              <button v-if="!task.completed" class="btn btn-secondary btn-sm float-end" v-on:click="completeTask(index)">Mark complete</button>
              <button v-if="!task.completed" class="btn btn-secondary btn-sm float-end" v-on:click="updateTask(index)">Update</button>
              <button class="btn btn-danger btn-sm float-end" v-on:click="deleteTask(index)">Delete</button>
            </p>
            
          </b-list-group-item>
        </b-list-group>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        token: '',
        tasks: [],
      };
    },
    async fetch() {
    // Check for the token on page load
    this.token = localStorage.getItem('token');

    if (!this.token) {
      // Redirect to the login page if no token is present
      this.$router.push('/login');
      return;
    }
    // Make a request to the Todo API using the token
    await this.fetchTasks();
  },
    methods: {
      formattedDueOn(dt) {
      const date = new Date(dt);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      },          
      async completeTask(index) {
        try {
          await this.$axios.put('/tasks/' + this.tasks[index].id + '/complete', {}, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          await this.fetchTasks();
        } catch (error) {
          console.error(error);
          // handle error
        }
      },  
      updateTask(index) {
        console.log(this.tasks[index]);
      },  
      async deleteTask(index) {
        try {
        await this.$axios.delete('/tasks/' + this.tasks[index].id, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          await this.fetchTasks();
        } catch (error) {
          console.error(error);
          // handle error
        }
      },
      async fetchTasks() {
        try {
          // Make a request to the Todo API using the token
          const response = await this.$axios.get('/tasks', {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
  
          // Assuming the tasks are returned in the 'tasks' field of the response
          this.tasks = response.data;
  
          // handle success
        } catch (error) {
          console.error(error);
          // handle error
        }
      },

      hideTaskFormComponent(formId) {
        console.log('hiding ' + formId);
        this.$emit('close-form', { formId: formId });
      },
      showTaskFormComponent(formId) {
        console.log('showing ' + formId);
        this.$emit('open-form', { formId: formId });
      },
    },
  };
  </script>
  