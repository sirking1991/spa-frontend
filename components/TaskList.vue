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
                  v-on:click="openTask()">Add task</button>
                <button class="btn btn-danger btn-sm" v-on:click="logout">Logout</button>
            </div>
        </div>

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
              <button v-if="!task.completed" class="btn btn-secondary btn-sm float-end" 
                v-on:click="completeTask(index)">Mark complete</button>
              <button v-if="!task.completed" class="btn btn-secondary btn-sm float-end" 
                v-on:click="updateTask(index)">Update</button>
              <button class="btn btn-danger btn-sm float-end" v-on:click="deleteTask(index)">Delete</button>
            </p>
            
          </b-list-group-item>
        </b-list-group>

        <b-modal id="bv-modal-taskform" hide-footer>
          <div class="d-block">
            <form @submit.prevent="saveTask">
              <input class="form-control" placeholder="Title" type="text" v-model="selectedTask.title" required />
              <input class="form-control mt-2" placeholder="Description" type="text" v-model="selectedTask.description"  />
              <input class="form-control mt-2" placeholder="Due on" type="date" v-model="selectedTask.due_on"  />
              <b-form-checkbox
              class="mt-2"
              id="completed"
              v-model="selectedTask.completed"
              name="completed"
              value="1"
              unchecked-value="0"
              >
              Completed
              </b-form-checkbox>
              <button class="btn btn-primary btn-sm mt-3" type="submit">Save</button>
              <button class="btn btn-secondary btn-sm mt-3" type="button" 
                  v-on:click="$bvModal.hide('bv-modal-taskform')">Close</button>
          </form>
          </div>
        </b-modal>        
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        token: '',
        tasks: [],
        selectedTask: {id:0, title:'', description:'', due_on:'', completed:false},
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
          await this.$axios.put('/tasks/' + this.tasks[index].id + '/complete', {});
          await this.fetchTasks();
        } catch (error) {
          console.error(error);
          // handle error
        }
      },  
      updateTask(index) {
        this.openTask(index);
      },  
      async deleteTask(index) {
        try {
        await this.$axios.delete('/tasks/' + this.tasks[index].id);
          await this.fetchTasks();
        } catch (error) {
          console.error(error);
          // handle error
        }
      },
      async fetchTasks() {
        try {
          // Make a request to the Todo API using the token
          const response = await this.$axios.get('/tasks');
  
          // Assuming the tasks are returned in the 'tasks' field of the response
          this.tasks = response.data;
  
          // handle success
        } catch (error) {
          console.error(error);
          // handle error
        }
      },
      openTask(index) {
        if(!this.tasks[index]){
          const dt = new Date();          
          this.selectedTask = {
            id:0, 
            title:'', 
            description:'', 
            due_on: dt.getFullYear() + '-' + dt.getMonth() +  '-' + dt.getDate(), 
            completed:false
          };
        } else {
          this.selectedTask = this.tasks[index];
          const dt = (new Date(this.selectedTask.due_on));
          this.selectedTask.due_on = dt.getFullYear() + '-' + dt.getMonth() +  '-' + dt.getDate();
        }
        this.$bvModal.show('bv-modal-taskform')
      },
      async saveTask() {
        try {
          if(this.selectedTask.id==0) {
            const response = await this.$axios.post('/tasks', this.selectedTask);
          } else {
            const response = await this.$axios.put('/tasks/' + this.selectedTask.id, this.selectedTask);
          }
          this.fetchTasks();
          this.$bvModal.hide('bv-modal-taskform')
        } catch (error) {
          console.log(error);
        }
      }
    },
  };
  </script>
  