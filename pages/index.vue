<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right ">
        <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/meetups/new" class="info">Organize Meetup</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12>          
        <v-carousel style="cursor: pointer;">
          <v-carousel-item
            v-for="meetup in meetups"
            :key="meetup.id"
            :src="meetup.imageUrl"
            transition="fade"
            reverse-transition="fade"
            to="/meetups/1" 
          >
            <v-container class="title">
              <v-layout row wrap>
                <v-flex xs12 class="text-xs-center">
                  {{meetup.title}}
                </v-flex>
              </v-layout>    
            </v-container>
          </v-carousel-item>
        </v-carousel>
      </v-flex>  
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Join our awesome meetups!</p>
      </v-flex>
    </v-layout>    
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      meetups: [
        {
          imageUrl:
            'https://cdn.images.express.co.uk/img/dynamic/136/590x/travel-activity-Madrid-Spain-nightlife-museums-bars-UploadExpress-Rob-Crossan-658625.jpg',
          id: '3asd342342342',
          title: 'Meetup in Madrid'
        },
        {
          imageUrl:
            'https://travel.usnews.com/static-travel/images/destinations/44/empire_state_building_getty_zsolt_hlinka.jpg',
          id: '32314ff4sdsff',
          title: 'Meetup in New York'
        }
      ]
    }
  }
}
</script>

<style scoped>
.title {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 2em;
}
</style>


