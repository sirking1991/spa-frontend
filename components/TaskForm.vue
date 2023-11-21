<style scoped>
.task-form {
    border: 1px solid #fff;
    border-radius: 15px;
    background-color: #fff;
    padding: 10px;
    margin: 10px;
}
</style>
<template>
    <div class="task-form">
        <form @submit.prevent="save">
            <input class="form-control" placeholder="Title" type="text" v-model="title" required />
            <input class="form-control mt-2" placeholder="Description" type="text" v-model="description"  />
            <input class="form-control mt-2" placeholder="Due on" type="date" v-model="due_on"  />
            <b-form-checkbox
            class="mt-2"
            id="completed"
            v-model="completed"
            name="completed"
            value="1"
            unchecked-value="0"
            >
            Completed
            </b-form-checkbox>
            <button class="btn btn-primary btn-sm mt-3" type="submit">Save</button>
            <button class="btn btn-secondary btn-sm mt-3" type="button" 
                v-on:click="isVisible=false">Close</button>
        </form>
    </div>
</template>

<script>
  export default {
    props: {
        formId: String,
    },
    data() {
        return {
            title: "",
            description: "",
            due_on: "",
            completed: false,

            isVisible: true
        };
    },

    methods: {
        close() {
            this.isHidden = true;
        },
        save(){
        }
    },

    onMounted() {
        // Listen for the 'close-form' event
        this.$root.$on('close-form', function(formId){
            if (formId === this.formId) {
                // Hide the component
                this.isVisible = false;
            }
        });
        this.$on('open-form', function(formId){
            console.log('handing open foem event for ' + formId + ' my id is ' + this.formId);
            // Check if the event is meant for this instance
            if (formId === this.formId) {
                // Hide the component
                this.isVisible = true;
            }
        });
    },
    beforeDestroy() {
        // Remove the event listener to avoid memory leaks
        this.$root.$off('close-form', this.handleCloseForm);
        this.$root.$off('open-form', this.handleOpenForm);
    },
}
</script>