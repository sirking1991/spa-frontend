<style>
.recipe-action-buttons{
  text-align: end;
}
</style>
<template>
    <div class="container w-50 mt-5">
        <div class="row">
            <div class="col-9">
                <h3>Recipes</h3>                
            </div>
            <div class="col-3"  align-v="end">
                <button class="btn btn-primary btn-sm"
                  v-on:click="openRecipeForm()">Add</button>
                <button class="btn btn-danger btn-sm" v-on:click="logout">Logout</button>
            </div>
        </div>

        <b-list-group v-if="recipes.length>0">
          <b-list-group-item button 
            v-for="(recipe, index) in recipes" :key="recipe.id"            
            >
            <span style="">{{ recipe.name }}</span>
            <span style="display: block; color:gray; font-style: italic; text-transform: capitalize;">{{ recipe.type }}</span>
            
            <p class="recipe-action-buttons" >
              <button class="btn btn-secondary btn-sm float-end" 
                v-on:click="updateRecipe(index)">Update</button>
              <button class="btn btn-danger btn-sm float-end" v-on:click="deleteRecipe(index)">Delete</button>
            </p>
            
          </b-list-group-item>
        </b-list-group>

        <b-alert show v-if="recipes.length==0">You currently have not recipe on record. Click the button above to create one.</b-alert>

        <b-modal id="bv-modal-recipeform" hide-footer>
          <div class="d-block">
            <form @submit.prevent="saveRecipe">
              <input class="form-control mb-2" placeholder="Title" type="text" v-model="selectedRecipe.name" required />
              <select class="form-control mb-2" v-model="selectedRecipe.type">
                <option value="dessert">Dessert</option>
                <option value="appetizer">Appetizer</option>
                <option value="main-dish">Main dish</option>
              </select>
              <b-form-textarea
                class="mb-2"
                v-model="selectedRecipe.ingredients"
                placeholder="Ingredients"
                rows="3"
                max-rows="6"
                ></b-form-textarea>
              <b-form-textarea
              class="mb-2"
                v-model="selectedRecipe.instruction"
                placeholder="Instruction"
                rows="3"
                max-rows="6"
                ></b-form-textarea>
              <button class="btn btn-primary btn-sm mt-3" type="submit">Save</button>
              <button class="btn btn-secondary btn-sm mt-3" type="button" 
                  v-on:click="$bvModal.hide('bv-modal-recipeform')">Close</button>
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
        recipes: [],
        selectedRecipe: {id:0, name:'', type:'dessert', ingredients:'', instruction:''},
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
      await this.fetchRecipes();
    },
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      },          
      updateRecipe(index) {
        this.openRecipeForm(index);
      },  
      async deleteRecipe(index) {
        try {
        await this.$axios.delete('/recipes/' + this.recipes[index].id);
          await this.fetchRecipes();
        } catch (error) {
          console.error(error);
          // handle error
        }
      },
      async fetchRecipes() {
        try {
          // Make a request to the Todo API using the token
          const response = await this.$axios.get('/recipes');
  
          // Assuming the recipes are returned in the 'recipes' field of the response
          this.recipes = response.data;
  
          // handle success
        } catch (error) {
          console.error(error);
          // handle error
        }
      },
      openRecipeForm(index) {
        if(!this.recipes[index]){
          this.selectedrecipe = {
            id:0, name:'', type:'dessert', ingredients:'', instruction:''
          };
        } else {
          this.selectedRecipe = this.recipes[index];
        }
        this.$bvModal.show('bv-modal-recipeform')
      },
      async saveRecipe() {
        try {
          if(this.selectedrecipe.id==0) {
            const response = await this.$axios.post('/recipes', this.selectedrecipe);
          } else {
            const response = await this.$axios.put('/recipes/' + this.selectedrecipe.id, this.selectedrecipe);
          }
          this.fetchRecipes();
          this.$bvModal.hide('bv-modal-recipeform')
        } catch (error) {
          console.log(error);
        }
      }
    },
  };
  </script>
  