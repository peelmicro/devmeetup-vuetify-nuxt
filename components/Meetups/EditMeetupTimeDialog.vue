<template>
  <v-dialog
    width="350px"
    persistent
    v-model="editDialog"
  >
    <v-btn accent slot="activator">
      Edit Time
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Time</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-time-picker v-model="editableTime" style="width: 100%" actions>
              <v-btn 
                class="blue--text darken-1" 
                flat 
                @click="editDialog = false"
              >Close</v-btn>
              <v-btn 
                class="blue--text darken-1" 
                flat 
                @click="onSaveChanges"
              >Save</v-btn>     
            </v-time-picker>
          </v-flex>
        </v-layout>   
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
function formatTime (date) {
  var d = new Date(date)
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
}
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editableTime: null
    }
  },
  methods: {
    onSaveChanges () {
      const newDate = new Date(this.meetup.date)
      const newHours = this.editableTime.match(/^(\d+)/)[1]
      const newMinutes = this.editableTime.match(/:(\d+)/)[1]
      newDate.setUTCHours(newHours)
      newDate.setUTCMinutes(newMinutes)

      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
      this.editDialog = false
    }
  },
  created () {
    this.editableTime = formatTime(this.meetup.date)
  }
}
</script>
